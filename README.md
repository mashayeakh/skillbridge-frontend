# skillbridge-frontend

A Next.js (App Router) TypeScript frontend for the SkillBridge project. This repository contains the UI used by students, tutors, and admins to browse tutors, book sessions, and manage profiles.

## Features

- Modern Next.js 16 App Router structure
- TypeScript, Tailwind CSS v4, and React 19
- React Query for data fetching and caching
- Role-based pages for admin, tutor, and public users
- Reusable UI primitives and components in `components/` and `src/ui` / `src/ui2`

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- @tanstack/react-query
- Radix UI primitives

## Prerequisites

- Node.js 18+ (or the version you use for Next 16)
- npm, yarn, or pnpm

## Getting started (local)

1. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn
```

2. Add environment variables (see below)

3. Run the development server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 in your browser.

## Environment variables

This project uses `@t3-oss/env-nextjs` and expects the following client env var at minimum:

- `NEXT_PUBLIC_BACKEND_URL` — URL of the backend API (must be a valid URL).

Create a `.env.local` file in the project root and add:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.example.com
```

Adjust other variables as needed.

## Available scripts

- `npm run dev` — runs Next.js in development mode
- `npm run build` — builds the app for production
- `npm run start` — starts the production server after `build`
- `npm run lint` — runs ESLint

These scripts are declared in `package.json`.

## Project structure (high level)

- `app/` — Next.js App Router pages and route groups (public, admin, tutor, dashboard)
- `components/` — shared React components and UI pieces
- `src/lib/` — API helpers, utils, and hooks
- `src/actions/` — client-side actions and API wrappers
- `public/` — static assets (images, videos)
- `src/env.ts` — typed environment config

## Notes on configuration

- The app expects the backend API to expose endpoints for authentication, tutors, sessions, and reviews. Update `src/lib/api.ts` and other API helpers to match your backend contract.

## Deploy

You can deploy to Vercel or any platform that supports Next.js. For Vercel, connect the repository and set the same environment variable (`NEXT_PUBLIC_BACKEND_URL`) in the project settings.

## Contributing

Contributions are welcome. Open issues or pull requests for bugs and enhancements.

## License

Add your license here.
