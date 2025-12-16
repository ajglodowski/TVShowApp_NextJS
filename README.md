## TV Show App

**TV Show App** is a social TV tracking + discovery app with a “social feed” feel: log shows, track watch status, rate shows, explore tags, follow users, and browse profiles with stats/visualizations.

## Features

- **Auth & accounts (Supabase Auth)**: sign up, login, email callback flow, reset/update password pages.
- **Watchlist + logging**: track shows by status (watchlist, catching up, rewatching, etc.) and keep progress up to date.
- **Show pages**: show details, ratings + status counts, tags/categories, cast/actors, similar show recommendations.
- **Profiles**: user pages, following/followers, lists, stats (including tag/service breakdowns and charts).
- **Images**:
  - Show images + profile pictures stored in **Google Cloud Storage**, served via `/pages/api` routes and/or pre-signed URLs.
  - Optional Vercel Blob upload path (experimental).
- **Modern UI**: App Router, React 19, Tailwind, Radix/shadcn UI components, charts.

## Tech stack

- **Next.js (App Router)**: UI and routing live under `app/` (with some legacy `/pages/api` API routes for file handling).
- **Supabase**: Auth + Postgres data (tables/views/RPC).
- **Storage**: Google Cloud Storage for images (plus optional Vercel Blob support).
- **Caching**: uses Next.js `useCache` (`'use cache'`) + `cacheLife()` and React `cache()` to reduce repeated Supabase calls.

## High-level architecture

### Routing and UI organization

- **App Router routes** live in `app/`.
  - `app/(main)/...` contains the main authenticated app routes (shows, profile, lists, search, etc.).
  - `app/components/...` contains shared UI components and page-level composition components.
- **Pages Router API routes** live in `pages/api/` (used where raw Node APIs are needed for multipart uploads and binary streaming).

### Data access pattern (“Service” modules)

Most routes/components delegate data fetching into `*Service.ts(x)` modules (for example `app/components/home/HomeService.tsx`, `app/(main)/show/[showId]/ShowService.tsx`, `app/utils/userService.ts`).

Common traits:

- **Server-side Supabase access** via `app/utils/supabase/server.ts`
  - `publicClient()` uses the anon key for public reads (views, counts, etc.).
  - `createClient()` creates a cookie-aware Supabase server client for authenticated reads/writes.
- **Client-side Supabase access** via `app/utils/supabase/client.ts` for browser interactions.
- **Caching**: many fetchers use `cache()` + `'use cache'`/`cacheLife()` to avoid re-fetching stable data.

### Auth flow

- **Signup logic** lives in `app/utils/supabase/AuthService.ts` (server action).
  - Creates the Supabase Auth user, then inserts a matching row into the `user` table.
  - Includes username validation + uniqueness checks.
- **Email redirect callback** is handled by `app/(main)/auth/callback/route.ts`, which exchanges the auth code for a session.
- **Session refresh / route protection (optional middleware)**: `app/utils/supabase/middleware.ts` exposes `updateSession(request)`, which can be wired into a Next.js `middleware.ts` to refresh cookies and redirect unauthenticated users to `/login`.

### Images and media

This repo uses **Google Cloud Storage** for images, with multiple access patterns:

- **Upload (authenticated)**: `pages/api/imageUploader.ts`
  - Accepts multipart form uploads (Formidable), converts to JPEG (Sharp), writes to GCS, returns the stored path.
  - Checks the current user via a Supabase server client before allowing upload.
- **Fetch (stream bytes)**: `pages/api/imageFetcher.ts`
  - Reads an object from GCS and returns the binary with caching headers.
- **Fetch (pre-signed URL)**: `pages/api/imageUrlFetcher.ts` and `app/actions/imageActions.ts`
  - Generates a short-lived signed URL for reads from GCS.
- **Average color**: `pages/api/averageColor.ts` and `app/actions/imageActions.ts`
  - Computes a 1x1 resize and returns an `rgb(r,g,b)` string used for UI styling.

There is also an **optional** Vercel Blob integration at `pages/api/vercelBlobUpload.ts` plus `app/components/imageUploader/imageUploaderService.tsx`.

### “Environment-aware” base URLs

`app/envConfig.tsx` centralizes how the app chooses a base URL in local vs production. Some services build API URLs using this (for example `/api/imageFetcher` URLs).

## Project structure (guide)

- **Routes**: `app/(main)/...`
  - `show/[showId]/...`: show pages and related services
  - `profile/[username]/...`: profiles + stats
  - `list/[listId]/...`: lists
  - `search/`, `discoverShows/`, `watchlist/`, `login/`, `signup/`, `resetPassword/`, `updatePassword/`
- **UI components**: `app/components/...` and `components/ui/...` (shadcn/Radix)
- **Domain models**: `app/models/...` (typed DTOs)
- **Supabase helpers**: `app/utils/supabase/...`
- **API routes**: `pages/api/...` (uploads, image fetch, signed URLs)

## Running locally

### Prereqs

- Node.js + npm
- A Supabase project (Auth + Postgres)
- A Google Cloud Storage bucket (or configure/disable image features)

### Install & run

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Environment variables

Create `.env.local` (not committed) and configure at least:

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (used by the cookie-aware server client in `app/utils/supabase/server.ts`)

### Google Cloud Storage (for production/deploy)

- `GCP_BUCKET_NAME`
- `GCP_PROJECT_ID`
- `GCP_SERVICE_ACCOUNT_EMAIL`
- `GCP_PRIVATE_KEY` (make sure newlines are correctly escaped if needed)

### Local GCP auth

For local dev, the code supports using a local credential file (`gcpCreds.json`) and/or falling back to your `gcloud` default credentials depending on the route/action.

## Deployment notes

- **Vercel** is the intended deployment target.
- `next.config.js` allows remote images from Vercel-hosted domains, Google Cloud Storage (`storage.googleapis.com`), and `localhost`.

## Contributing / maintenance

- “Service” modules are the preferred place to add/adjust Supabase queries so components stay focused on rendering.
