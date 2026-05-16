# CampFinder

A full-stack campground discovery platform built with Next.js 15. Users can browse, create, and review campgrounds, with interactive maps, AI-powered chat assistance, a blog, and a newsletter system.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Database**: PostgreSQL via Supabase + Prisma ORM
- **Auth**: Supabase Auth (email + Google OAuth)
- **Storage**: Supabase Storage (campground images)
- **Maps**: Mapbox GL / react-map-gl
- **AI**: Vercel AI SDK + Anthropic Claude (campground chatbot)
- **Email**: Nodemailer (contact form + newsletter)
- **UI**: Tailwind CSS v4, shadcn/ui, Radix UI
- **Analytics**: Vercel Analytics

## Features

- Browse campgrounds with carousels (most reviewed, newest, budget-friendly)
- Full campground detail pages with image galleries, reviews, and ratings
- Interactive Mapbox map on detail pages
- AI chatbot assistant on each campground page
- Weather widget per campground location
- User auth with profile management
- Create / update / delete campgrounds (authenticated)
- Image upload with drag-and-drop ordering
- Review system with star ratings
- Blog with categories and reading time
- Newsletter subscription with confirmation
- Contact form
- SEO: sitemap.xml, robots.txt, Open Graph metadata
- ISR (Incremental Static Regeneration) on public pages

## Getting Started

**Requirements**: Node.js 20+, pnpm 9

```bash
pnpm install
```

Copy `.env` and fill in the values (see [Environment Variables](#environment-variables)):

```bash
cp .env.example .env
```

Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

Generate Prisma client and seed the database:

```bash
pnpm prisma generate
pnpm prisma db seed
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase Postgres connection string (pooled) |
| `DIRECT_URL` | Supabase Postgres direct connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token |
| `NEXT_PUBLIC_SITE_URL` | Full site URL (e.g. `https://campfinder.vercel.app`) |
| `ANTHROPIC_API_KEY` | Anthropic API key for the campground chatbot |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_SECURE` | `true` for TLS |
| `SMTP_USER` | SMTP username |
| `SMTP_PASSWORD` | SMTP password |
| `SMTP_FROM_EMAIL` | Sender email address |
| `SMTP_FROM_NAME` | Sender display name |
| `SMTP_TO_EMAIL` | Recipient for contact form submissions |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm analyze` | Bundle analyzer |
| `pnpm prisma db seed` | Seed the database |

## Project Structure

```
src/
  app/          # Next.js App Router pages and API routes
  components/   # React components (campground, blog, auth, maps, newsletter, ui)
  lib/          # Prisma client, Supabase client, utilities
  types/        # Shared TypeScript types
  hooks/        # Custom React hooks
prisma/
  schema.prisma # Database schema
  seed.ts       # Seed script
scripts/        # One-off utility scripts (geocoding, migrations)
```

## Deployment

Deployed on Vercel. Set all environment variables in the Vercel project settings and connect the Supabase integration for `DATABASE_URL` and `DIRECT_URL`.
