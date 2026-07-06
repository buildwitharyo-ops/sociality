# Sociality

A social-media app — share a photo with a caption, like and comment, follow people, and bookmark posts to come back to later. This repo is the frontend; it runs against the Sociality REST API, so the backend is already provided and hosted.

It's built with Next.js (App Router) and TypeScript. Server data goes through TanStack Query; the small amount of client-only state (the auth session, plus saved/follow flags the API doesn't return per item) lives in Redux Toolkit. Styling is Tailwind with shadcn/ui, forms use React Hook Form + Zod, and dates use Day.js.

## Running it locally

You'll need Node 20 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

The only thing to configure is the API base URL, and `.env.example` already points at the hosted backend:

```
NEXT_PUBLIC_API_BASE_URL=https://be-social-media-api-production.up.railway.app
```

Create an account from `/register` and you're in. You can also browse the feed, profiles, and search while signed out — anything that writes (like, follow, comment, post) will just send you to log in first.

`npm run build` makes a production build, `npm run start` serves it, `npm run lint` runs ESLint.

## Project layout

```
src/
  app/            routes (App Router)
    (auth)/       login, register — no app chrome
    (app)/        everything behind the nav: feed, posts/[id], profile, search, create
  components/     shared UI — PostCard, UserChip, the like/save/follow buttons,
                  empty/error/loading states… (shadcn primitives live in ui/)
  features/       one folder per domain: auth, feed, posts, comments, likes,
                  follows, profile, search — each keeps its own hooks + components
  lib/            the API client + types, query keys, small helpers
  store/          Redux store + typed hooks
  hooks/          a couple of reusable hooks (debounce, infinite scroll)
```

Everything that talks to the backend goes through `lib/api`. That's also where the responses get normalized, so the rest of the app never has to deal with the raw wire format.

## Notes on the API

A few things about the backend that the frontend works around, so they don't catch you off guard:

- `GET /api/posts/:id` (post detail) always comes back with `likedByMe: false`, even for posts you've liked. The like state is taken from the feed/list caches instead, and kept in sync through the like mutation.
- List endpoints return their array under different keys — `items`, `posts`, `users`, `comments` — depending on the route. `lib/api` normalizes all of them to `{ items, pagination }`.
- There's no "saved" flag on post objects, so saved state is tracked on the client (seeded from `/api/me/saved`).
- Likes, follows, and saves are idempotent on the server, so tapping them fast never double-counts.

## Deploying

Standard Next.js app, nothing special — deploy it wherever you'd deploy Next. Just remember to set `NEXT_PUBLIC_API_BASE_URL` in the environment.
