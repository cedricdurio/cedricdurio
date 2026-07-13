#!/usr/bin/env node
// Check an AOL Mail inbox over IMAP, summarize it, and optionally delete
// selected messages. Deletion always requires an explicit interactive
// selection + confirmation — nothing is deleted just by running the script.

import { ImapFlow } from "imapflow";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import "dotenv/config";

const AOL_IMAP_HOST = "imap.aol.com";
const AOL_IMAP_PORT = 993;

function parseArgs(argv) {
  const args = {
    mailbox: process.env.AOL_MAILBOX || "INBOX",
    limit: 50,
    unread: false,
    from: null,
    subject: null,
    olderThanDays: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--mailbox":
        args.mailbox = argv[++i];
        break;
      case "--limit":
        args.limit = Number(argv[++i]);
        break;
      case "--unread":
        args.unread = true;
        break;
      case "--from":
        args.from = argv[++i];
        break;
      case "--subject":
        args.subject = argv[++i];
        break;
      case "--older-than":
        args.olderThanDays = Number(argv[++i]);
        break;
      case "-h":
      case "--help":
        printHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        printHelp();
        process.exit(1);
    }
  }
  return args;
}

function printHelp() {
  console.log(`
Usage: npm start -- [options]

Options:
  --mailbox <name>      Mailbox to check (default: INBOX)
  --limit <n>           Max messages to list (default: 50)
  --unread               Only show unread messages
  --from <substring>     Only show messages whose sender contains this
  --subject <substring>  Only show messages whose subject contains this
  --older-than <days>    Only show messages older than N days
  -h, --help             Show this help

Credentials are read from the environment (see .env.example):
  AOL_EMAIL           your AOL address
  AOL_APP_PASSWORD    an AOL app password (not your regular password)
`);
}

function requireCredentials() {
  const { AOL_EMAIL, AOL_APP_PASSWORD } = process.env;
  if (!AOL_EMAIL || !AOL_APP_PASSWORD) {
    console.error(
      "Missing AOL_EMAIL and/or AOL_APP_PASSWORD.\n" +
        "Copy .env.example to .env and fill them in.\n" +
        "AOL requires a generated 'app password' for IMAP access, not your normal login password:\n" +
        "  AOL Account Security settings -> Generate app password.",
    );
    process.exit(1);
  }
  return { user: AOL_EMAIL, pass: AOL_APP_PASSWORD };
}

function buildSearchQuery(args) {
  const query = {};
  if (args.unread) query.seen = false;
  if (args.from) query.from = args.from;
  if (args.subject) query.subject = args.subject;
  if (args.olderThanDays) {
    const before = new Date();
    before.setDate(before.getDate() - args.olderThanDays);
    query.before = before;
  }
  return Object.keys(query).length > 0 ? query : { all: true };
}

async function findTrashMailbox(client) {
  const list = await client.list();
  const trash = list.find((box) => box.specialUse === "\\Trash");
  if (trash) return trash.path;
  const byName = list.find((box) => /^trash$/i.test(box.name));
  return byName ? byName.path : "Trash";
}

function formatMessage(index, msg) {
  const flagIcon = msg.flags?.has("\\Seen") ? " " : "*";
  const date = msg.envelope?.date
    ? new Date(msg.envelope.date).toISOString().slice(0, 10)
    : "unknown-date";
  const from = msg.envelope?.from?.[0]
    ? `${msg.envelope.from[0].name || ""} <${msg.envelope.from[0].address}>`.trim()
    : "unknown-sender";
  const subject = msg.envelope?.subject || "(no subject)";
  return `${String(index).padStart(3)}. [${flagIcon}] ${date}  ${from}\n     ${subject}`;
}

function parseSelection(input, max) {
  const trimmed = input.trim().toLowerCase();
  if (trimmed === "" || trimmed === "q") return [];
  if (trimmed === "a" || trimmed === "all") {
    return Array.from({ length: max }, (_, i) => i + 1);
  }
  const indices = new Set();
  for (const part of trimmed.split(",")) {
    const piece = part.trim();
    if (!piece) continue;
    const rangeMatch = piece.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      for (let i = start; i <= end; i++) indices.add(i);
    } else if (/^\d+$/.test(piece)) {
      indices.add(Number(piece));
    }
  }
  return [...indices].filter((i) => i >= 1 && i <= max);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const auth = requireCredentials();

  const client = new ImapFlow({
    host: AOL_IMAP_HOST,
    port: AOL_IMAP_PORT,
    secure: true,
    auth,
    logger: false,
  });

  await client.connect();
  console.log(`Connected as ${auth.user}.`);

  try {
    await runSession(client, args);
  } finally {
    await client.logout();
  }
}

async function runSession(client, args) {
  const lock = await client.getMailboxLock(args.mailbox);
  let messages = [];
  try {
    const mailbox = client.mailbox;
    const unseenUids = await client.search({ seen: false });
    console.log(
      `\nMailbox "${args.mailbox}": ${mailbox.exists} total message(s), ${unseenUids.length} unread.\n`,
    );

    const query = buildSearchQuery(args);
    const uids = await client.search(query);
    const recentFirst = uids.slice(-args.limit).reverse();

    if (recentFirst.length === 0) {
      console.log("No messages match the given filters.");
      return;
    }

    for await (const msg of client.fetch(recentFirst, {
      envelope: true,
      flags: true,
      uid: true,
    })) {
      messages.push(msg);
    }
    // client.fetch does not guarantee order; sort to match recentFirst (most recent first)
    const order = new Map(recentFirst.map((uid, i) => [uid, i]));
    messages.sort((a, b) => order.get(a.uid) - order.get(b.uid));

    console.log(`Showing ${messages.length} message(s) (most recent first):\n`);
    messages.forEach((msg, i) => console.log(formatMessage(i + 1, msg)));

    // Quick sender summary
    const bySender = new Map();
    for (const msg of messages) {
      const addr = msg.envelope?.from?.[0]?.address || "unknown";
      bySender.set(addr, (bySender.get(addr) || 0) + 1);
    }
    const topSenders = [...bySender.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    console.log("\nTop senders in this list:");
    for (const [addr, count] of topSenders) {
      console.log(`  ${count.toString().padStart(3)}  ${addr}`);
    }
  } finally {
    lock.release();
  }

  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const selection = await rl.question(
      "\nEnter message numbers to delete (e.g. 1,3,5-7), 'a' for all shown, or press Enter to quit without deleting: ",
    );
    const indices = parseSelection(selection, messages.length);
    if (indices.length === 0) {
      console.log("Nothing selected — no changes made.");
      return;
    }

    const toDelete = indices.map((i) => messages[i - 1]);
    console.log("\nAbout to move the following message(s) to Trash:");
    toDelete.forEach((msg, i) => console.log(formatMessage(i + 1, msg)));

    const confirm = await rl.question(
      `\nConfirm moving ${toDelete.length} message(s) to Trash? (y/N): `,
    );
    if (confirm.trim().toLowerCase() !== "y") {
      console.log("Cancelled — no changes made.");
      return;
    }

    const lock2 = await client.getMailboxLock(args.mailbox);
    try {
      const trashMailbox = await findTrashMailbox(client);
      const uidsToDelete = toDelete.map((m) => m.uid);
      await client.messageMove(uidsToDelete, trashMailbox, { uid: true });
      console.log(`Moved ${uidsToDelete.length} message(s) to "${trashMailbox}".`);
    } finally {
      lock2.release();
    }
  } finally {
    rl.close();
  }
}

main()
  .catch((err) => {
    console.error("Error:", err.message || err);
    process.exitCode = 1;
  })
  .finally(async () => {
    process.exit(process.exitCode || 0);
  });
