# Prime Bites 🍢

A restaurant discovery app — find restaurants near a zip code, filter by
cuisine, read and leave ratings/reviews, or let the app pick something for you.

## Features

- Browse a directory of restaurants across San Francisco, New York, Chicago,
  and Los Angeles
- Zip-code lookup sorts restaurants by distance from you
- Filter by cuisine
- "Surprise me" button picks a random restaurant from the current list
- Sign in / create a profile to leave a 1-5 star rating and comment on a
  restaurant; see the average rating and full review list on each restaurant's
  page
- Account page shows your saved zip code and every review you've written

Profiles, saved zip code, and reviews are stored in the browser's
`localStorage` (no backend/server, no password hashing) purely to demonstrate
the flow — don't reuse this auth approach for anything handling real user data.

## Tech stack

- React + TypeScript, built with Vite
- Tailwind CSS v4
- React Router for client-side routing

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint
