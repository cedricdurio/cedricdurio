# AOL email connector

A standalone CLI that connects to an AOL Mail inbox over IMAP, lists and
summarizes messages, and lets you interactively pick which ones to move to
Trash. It never deletes anything on its own — every run ends with either no
selection (nothing happens) or an explicit `y/N` confirmation before any
message is moved.

This tool is intentionally separate from the Prime Bites app in the rest of
this repo (different purpose, different runtime, holds email credentials) —
it has its own `package.json` and is not wired into the Vite build.

## Setup

```bash
cd aol-email-connector
npm install
cp .env.example .env
```

Edit `.env` and fill in:

- `AOL_EMAIL` — your AOL address
- `AOL_APP_PASSWORD` — an **app password**, not your normal AOL login
  password. AOL requires this for third-party IMAP clients. Generate one
  from AOL Account Security settings → App passwords.

`.env` is gitignored — your credentials never get committed.

## Usage

```bash
npm start
# or with filters:
npm start -- --unread --limit 20
npm start -- --from newsletter@example.com
npm start -- --older-than 90
```

Each run:

1. Connects and prints a quick summary (total messages, unread count).
2. Lists matching messages (date, sender, subject) with a top-senders
   breakdown.
3. Prompts for which numbers to delete (`1,3,5-7`, `a` for all shown, or
   Enter to quit without changes).
4. Shows exactly what was selected and asks for `y/N` confirmation.
5. Only on `y` does it move the selected messages to Trash (recoverable —
   not a permanent/immediate purge).

Run `npm start -- --help` for all filter options.
