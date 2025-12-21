# Wandertrails

Festival-night travel themed Next.js (App Router) + TypeScript + Tailwind CSS app.

## Quick start (local)

### 1) Install deps

```bash
npm install
```

### 2) Environment variables

Create **`.env.local`** in the project root (Next.js reads this automatically).

#### Option A — Local auth server (default)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> The frontend defaults to `http://localhost:4000` in dev if `NEXT_PUBLIC_API_URL` is missing, but you should still set it.

#### Option B — Supabase auth (recommended for real DB)

Add these to **`.env.local`**:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

When Supabase vars are present, the app will use Supabase for login/signup/session.

### 3) Run everything with one command

```bash
npm run dev
```

This runs:
- Next.js dev server
- Express auth server in `server/`

## Scripts

- `npm run dev` — runs **frontend + backend** together
- `npm run dev:web` — frontend only
- `npm run dev:server` — backend only
- `npm run build` — Next build

## Auth (current implementation)

### Frontend routes
- `/login`
- `/signup`
- `/journeys` (protected)

### Navbar auth state
- Logged out: **Login / Sign up**
- Logged in: **My Journeys / Logout**

### Backend auth APIs (Express)
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

### Security model
- Passwords hashed with `bcryptjs`
- JWT stored in an **HTTP-only cookie**
- Frontend uses `credentials: 'include'`

## Backend (server/)

### Setup

```bash
npm install --prefix server
```

### Env
You can either create `server/.env` **or** put these variables in the root `.env.local` (the server will load root env files too when started via `npm run dev`).

Example:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=please-change-me-to-a-long-random-secret

# Storage (dev)
USERS_FILE=./data/users.json
```

## Supabase (optional, DB-backed)

If `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set, the app uses **Supabase Auth**.

Signup stores the provided name into **auth user metadata** (`user_metadata.name`).
If you prefer a `profiles` table, we can add that next (recommended for personalization / saved journeys).

## Implementation log

### 2025-12-18
- Added Express auth server in `server/` (JWT cookie auth; signup/login/me/logout)
- Added global auth provider in the frontend
- Added `/login` and `/signup` pages matching existing theme patterns
- Added protected `/journeys` route
- Updated navbar to show Login/Signup vs My Journeys/Logout
- Updated `npm run dev` to run frontend + backend together via `concurrently`

---

## Notes for future changes

When you ask for new features (saved journeys, intent memory, chatbot personalization), we’ll append design/architecture notes and the implementation summary to the **Implementation log** section above.

## Deploying to Vercel — common pitfalls

- Required env vars (set these in the Vercel Project Settings > Environment Variables):
	- `NEXT_PUBLIC_API_URL`: full URL to your auth backend (e.g. `https://auth.example.com`) — if omitted in production the frontend will use relative paths and must be proxied to a backend.
	- `JWT_SECRET` and any server-side secrets used by your backend (on the backend deployment).

- If your backend is hosted separately, set `NEXT_PUBLIC_API_URL` to that backend URL.
- If you want the frontend to proxy `/auth` to an external backend from the same Vercel deployment, add a `vercel.json` rewrite like the example in `vercel.json.example`.

If you see `Request failed (405)` from the frontend on deploy, it usually means the request reached an endpoint that doesn't accept the HTTP method — commonly because the frontend is hitting the wrong service (for example, the backend is not reachable or `NEXT_PUBLIC_API_URL` is unset and the route isn't proxied). Configure `NEXT_PUBLIC_API_URL` or add a rewrite to fix it.
