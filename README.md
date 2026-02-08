# skillbridge-frontend

A modern Next.js frontend for SkillBridge, a full-stack platform connecting students with tutors. Built with TypeScript, Tailwind CSS, and Radix UI for a seamless user experience.

**Live:** https://skillbridgefrontend-delta.vercel.app/

## Features

- Responsive role-based interfaces for students, tutors, and administrators
- Tutor browsing and profile management
- Session booking and review system
- Modern UI components with Radix UI
- Server-side rendering and static optimization with Next.js 16

## Tech Stack

- **Next.js 16** — Full-stack framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS 4** — Utility-first styling
- **Radix UI** — Accessible component primitives
- **TanStack React Query** — Data synchronization and caching

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Scripts

- `npm run dev` — runs Next.js in development mode
- `npm run build` — builds the app for production
- `npm run start` — starts the production server after `build`
- `npm run lint` — runs ESLint

These scripts are declared in `package.json`.

## Project Structure

```
skillbridge-frontend/
├── public/
│   ├── images/              # Static images
│   └── videos/              # Static videos
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (admin)/         # Admin dashboard routes
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   ├── (dashboard)/     # Student dashboard routes
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/
│   │   ├── (public)/        # Public routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── become-tutor/
│   │   │   ├── browse-tutor/
│   │   │   ├── browsetutors/
│   │   │   └── tutors/
│   │   ├── (tutor)/         # Tutor dashboard routes
│   │   │   ├── layout.tsx
│   │   │   └── tutor/
│   │   ├── layout.tsx       # Root layout
│   │   ├── loading.tsx      # Loading state
│   │   ├── not-found.tsx    # 404 page
│   │   └── globals.css      # Global styles
│   │
│   ├── actions/             # Server actions
│   │   ├── admin.ts
│   │   ├── book_session.ts
│   │   ├── reviews-page.ts
│   │   ├── student.ts
│   │   └── tutor.ts
│   │
│   ├── components/          # Reusable components
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   └── ModeToggle.tsx
│   │   ├── modules/
│   │   │   ├── authentication/
│   │   │   └── homepage/
│   │   ├── ui/              # Radix UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── ...more
│   │   ├── ui2/             # Additional UI components
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── carousel.tsx
│   │   │   └── ...more
│   │   ├── admin-dashboard-sidebar.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── dashboard-sidebar.tsx
│   │   ├── tutor-dashboard-sidebar.tsx
│   │   ├── tutor-list.tsx
│   │   ├── tutor-profile.tsx
│   │   ├── profile.tsx
│   │   ├── search-form.tsx
│   │   ├── file-upload.tsx
│   │   ├── footer2.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── logo.tsx
│   │   ├── NavbarClient.tsx
│   │   ├── price.tsx
│   │   ├── RequireAuth.tsx
│   │   └── version-switcher.tsx
│   │
│   ├── lib/                 # Utilities & API helpers
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── validations/
│   │   ├── api.ts
│   │   ├── apiFetch.ts
│   │   ├── auth-clients.ts
│   │   ├── booking.ts
│   │   ├── student-dashboard.api.ts
│   │   └── utils.ts
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── use-as-ref.ts
│   │   ├── use-isomorphic-layout-effect.ts
│   │   └── use-lazy-ref.ts
│   │
│   ├── providers/           # Context providers
│   │   ├── QueryProviders.tsx
│   │   └── ThemeProvider.tsx
│   │
│   ├── context/             # React contexts
│   │   └── LanguageContext.tsx
│   │
│   ├── data/                # Static data & utilities
│   │   ├── tutors.ts
│   │   └── dummy/
│   │       └── dummyTutor.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── better-auth.d.ts
│   │   ├── session.ts
│   │   └── tutor.ts
│   │
│   ├── constants/           # Constants
│   │   └── role.ts
│   │
│   ├── service/             # Services
│   │   └── user.service.ts
│   │
│   └── env.ts               # Environment configuration
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── eslint.config.mjs
├── components.json          # shadcn/ui config
└── README.md                # This file
```

## Key Directories

- **`src/app/`** — Next.js 16 App Router with route groups for different user roles (admin, dashboard, public, tutor)
- **`src/components/`** — Modular React components including UI primitives, layout components, and feature modules
- **`src/lib/`** — API clients, utility functions, hooks, and validation schemas
- **`src/actions/`** — Server actions for mutations across different features
- **`src/providers/`** — React context providers (Query, Theme)
- **`src/hooks/`** — Custom React hooks for common patterns
- **`src/types/`** — TypeScript type definitions and interfaces


## Contributing

Contributions are welcome. Open issues or pull requests for bugs and enhancements.
