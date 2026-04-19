# Pulsebeed

Pulsebeed is a full-stack, high-performance content hub that mixes videos and long-form articles in one feed (YouTube + Medium style).

Tech stack:
- Next.js (App Router)
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Neon)
- Zod validation
- NextAuth
- React Query (optimistic UI + infinite feed)

## Implemented Features

### User Experience
- Unified discovery feed (`VIDEO` + `ARTICLE`) with:
  - Infinite loading via cursor pagination
  - Type filtering (`ALL`, `VIDEO`, `ARTICLE`)
  - Sorting (`latest`, `trending`)
- Optimistic UI:
  - Like and bookmark toggle instantly in UI
  - API sync in background
- Continue Watching/Reading:
  - Progress save endpoint
  - Debounced sync every ~8 seconds + unmount sync in content viewer
- Fast search:
  - `/api/search` title search
  - PostgreSQL trigram index migration included
- Dark/Light theme toggle + responsive layout + skeleton loaders

### Admin Experience
- Admin dashboard (`/admin`) to:
  - Create content
  - Delete content
  - Control slug behavior with `regenerateSlug` toggle
- Slug integrity:
  - Slug updates only when explicitly requested

### Data Integrity + Performance
- Atomic increments for engagement counters (`likesCount`, `bookmarksCount`, `viewCount`)
- Idempotent engagement handling with unique constraints
- No N+1 for user engagement state in feed queries (single include query)
- Zod parsing on every API route input

## Database Schema

Main models in `prisma/schema.prisma`:
- `User` (`role`: `USER | ADMIN`)
- `Content` (`type`: `VIDEO | ARTICLE`, unique `slug`, counters, metadata)
- `Engagement` (join table with composite unique `[userId, contentId, type]`)
- `Progress` (`lastPosition`, `isCompleted`, unique `[userId, contentId]`)
- NextAuth models: `Account`, `Session`, `VerificationToken`

Search optimization migration:
- `prisma/migrations/20260419_add_search_indexes/migration.sql`
  - `CREATE EXTENSION IF NOT EXISTS pg_trgm`
  - GIN trigram index on `"Content"."title"`

## Project Structure

```txt
app/
  api/
  admin/
  auth/
  content/
  continue/
components/
lib/
services/
prisma/
```

## Environment Variables

Copy `.env.example` to `.env` and fill:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
ADMIN_EMAIL="admin@pulsebeed.dev"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="Pulsebeed <no-reply@pulsebeed.dev>"
```

## Installation and Run

1. Install dependencies

```bash
npm install
```

2. Generate Prisma client

```bash
npm run db:generate
```

3. Apply migrations (required by assignment)

```bash
npx prisma migrate dev
```

Equivalent script:

```bash
npm run db:migrate
```

4. Optional: seed 10,000 records

```bash
npm run db:seed
```

5. Start app

```bash
npm run dev
```

Open:
- `http://localhost:3000` (feed)
- `http://localhost:3000/admin` (admin)

## API Endpoints

- `GET /api/feed?cursor=&type=&sort=&limit=`
- `GET /api/search?q=&limit=`
- `POST /api/engagement/like`
- `POST /api/engagement/bookmark`
- `POST /api/progress/upsert`
- `GET /api/continue`
- `GET|POST|PATCH|DELETE /api/admin/content`
- `GET /api/content/[slug]`
- `GET|POST /api/auth/[...nextauth]`

## Seed Data

`prisma/seed.ts` generates:
- 10,000+ content records
- Demo users + admin
- Engagement and progress records

Run:

```bash
npm run db:seed
```

## Build and Quality

```bash
npm run lint
npm run build
```

Both commands pass in current implementation.

## Deployment (Neon + Vercel)

1. Create Neon DB and copy connection string.
2. Add env vars in Vercel project settings.
3. Deploy:

```bash
vercel --prod
```

4. Run production migrations:

```bash
npx prisma migrate deploy
```

## Assessment Checklist Mapping

- T3-style stack: implemented
- Infinite feed + mixed media: implemented
- Optimistic like/bookmark: implemented
- Continue watching/reading persistence: implemented
- Zod on API input: implemented
- Idempotency + atomic operations: implemented
- Cursor pagination: implemented
- Search indexing migration (GIN/Trigram): implemented
- Admin CRUD and slug handling: implemented
- Seed script for scale testing: implemented
