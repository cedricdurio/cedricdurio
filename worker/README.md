# Prime Bites Yelp Proxy

A small Cloudflare Worker that proxies restaurant searches to the
[Yelp Fusion API](https://docs.developer.yelp.com/docs/fusion-intro), keeping
the Yelp API key private (it can never live in the frontend, since GitHub
Pages is static and anyone can view-source it).

## Routes

- `GET /restaurants?zip=94103` — searches restaurants near a zip code
- `GET /restaurants/:id` — fetches a single restaurant's details by its Yelp
  business ID

Both return `{ restaurants: [...] }` / `{ restaurant: {...} }` shaped to match
the frontend's `Restaurant` type.

## One-time setup

1. **Get a Yelp Fusion API key**
   - Sign up at https://docs.developer.yelp.com/docs/fusion-intro and create
     an app to get an API key (no credit card required).

2. **Get a Cloudflare account + API token**
   - Sign up at https://dash.cloudflare.com (free tier is enough).
   - Find your **Account ID** on the dashboard's right sidebar.
   - Create an API token at https://dash.cloudflare.com/profile/api-tokens
     using the **"Edit Cloudflare Workers"** template.

3. **Add these as GitHub Actions secrets** (repo Settings → Secrets and
   variables → Actions → New repository secret):
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `YELP_API_KEY`

4. **Push to `main`** (or run the "Deploy Yelp Proxy Worker" workflow
   manually from the Actions tab). This builds and deploys the Worker and
   pushes `YELP_API_KEY` to it as a Worker secret.

5. **Find the deployed Worker's URL** — after the workflow run finishes,
   check its logs, or check https://dash.cloudflare.com under Workers &
   Pages. It'll look like:
   `https://prime-bites-yelp-proxy.<your-subdomain>.workers.dev`

6. **Point the frontend at it** — add a repository **variable** (not secret,
   it's just a URL) named `VITE_YELP_PROXY_URL` set to that address (repo
   Settings → Secrets and variables → Actions → Variables tab). The next
   push to `main` will rebuild the Pages site using it.

Until steps 3–6 are done, the app falls back to its built-in demo restaurant
list — nothing breaks, it just won't show real, live results.

## Local development

```bash
cd worker
npm install
npx wrangler dev
```

`wrangler dev` will prompt for a Yelp API key locally (or set it via
`npx wrangler secret put YELP_API_KEY` for local persistence, or a `.dev.vars`
file — see [Wrangler's docs](https://developers.cloudflare.com/workers/wrangler/configuration/#secrets)).
