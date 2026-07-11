# Prime Bites 🍢

A food-ordering web app for Prime Bites — browse the menu by category, build an
order, and check out.

## Features

- Menu browsing across categories (Signature Bites, Starters, Mains, Drinks, Desserts)
- Cart with quantity controls, running subtotal, and item removal
- Zip-code lookup that resolves your nearest of four locations and checks
  delivery availability for that zip
- Sign in / create a profile to save your details and view order history
- Checkout flow with pickup/delivery selection, tax, and delivery fee
- Order confirmation screen with a generated order number

Checkout is a front-end demo only — no real payments are processed. Profiles,
saved locations, and order history are stored in the browser's `localStorage`
(no backend/server, no password hashing) purely to demonstrate the flow —
don't reuse this auth approach for anything handling real user data.

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
