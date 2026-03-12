# Project Guidelines

## Build and Test
- The app root is `sebastianboscan/`. Run install/dev/build/lint commands from that directory, not from the workspace root.
- Primary commands:
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
  - `npm run start` (after build)
- No test runner is currently configured. Do not invent or run a non-existent `test` script.

## Architecture
- This is a Next.js 16 + TypeScript App Router project.
- Route pages live in `sebastianboscan/app/**/page.tsx`; shared app shell and metadata are in `sebastianboscan/app/layout.tsx`.
- Keep custom UI sections/components in `sebastianboscan/components/`.
- Treat `sebastianboscan/components/ui/` as shadcn/ui generated components: do not manually refactor or restyle these files unless explicitly requested.
- Prefer server components by default; add `"use client"` only when hooks, browser APIs, or client-side interactivity are required.

## Code Style
- Use TypeScript strict-mode compatible code and keep imports using the `@/*` alias when appropriate.
- Follow existing component patterns: functional components, clear prop typing, and minimal local state.
- Reuse theme tokens and utilities from `sebastianboscan/app/globals.css`; avoid hardcoding new design primitives when existing tokens/styles already cover the need.

## Conventions
- Maintain the site’s tactical HUD visual language: dark background, blue-accent highlights, grid/overlay motifs, monospace uppercase metadata labels, and crosshair-oriented interactions where already used.
- Preserve animation style already defined in global CSS (`fade-in`, `fade-up`) and existing transition patterns.
- Metadata/base URL logic follows `NEXT_PUBLIC_SITE_URL` -> `VERCEL_URL` -> `http://localhost:3000`; keep this behavior consistent when touching metadata or canonical URL logic.
- When adding new reusable primitives, prefer generating via shadcn CLI instead of hand-authoring copies of UI primitives.