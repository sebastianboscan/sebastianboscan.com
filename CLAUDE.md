# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

The Next.js app lives in the `sebastianboscan/` subdirectory. **All commands must be run from there**, not the repo root.

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
```

No test runner is configured — there is no `test` script; do not invent one.

## Tech Stack

- **Next.js 16** App Router, **React 19**, TypeScript strict mode, `@/*` path alias maps to the app root
- **Tailwind CSS v4** — no `tailwind.config`; everything is CSS-first in `app/globals.css` via `@theme inline` / `@custom-variant`
- **shadcn/ui** in `components/ui/` — Radix-based, generated. Add new primitives via the shadcn CLI; don't hand-refactor these files unless asked.
- Fonts via `next/font/google`: **Geist** (`--font-geist-sans`), **Geist Mono** (`--font-geist-mono`), **Syne** (`--font-syne`, used for display headings)

## Architecture

### Content is separated from presentation

The portfolio's copy lives in dedicated `content.ts` modules exporting `readonly`-typed const arrays, consumed by presentational components:

- [components/home/content.ts](sebastianboscan/components/home/content.ts) — hero links, about, experience, projects, organizations, contact
- [components/header/content.ts](sebastianboscan/components/header/content.ts) — `navItems`, the single source of truth for both nav links and scroll-spy targets
- [components/education/content.ts](sebastianboscan/components/education/content.ts) — education timeline

**Edit copy in `content.ts`, not in JSX.** This matters most for `home/content.ts`, which is consumed by *both* the homepage sections and the `/display-app` glasses route — a content change propagates to both surfaces.

### Page composition

[app/page.tsx](sebastianboscan/app/page.tsx) is a server component that stacks section components in order. Sections are self-contained `<section id="...">` blocks; their `id` must match an entry in `header/content.ts` for the nav highlight to work. [useActiveSection.ts](sebastianboscan/components/header/useActiveSection.ts) drives scroll-spy with an IntersectionObserver over those same ids.

`Education` is reused both as a homepage section and as the whole of the standalone [app/education/page.tsx](sebastianboscan/app/education/page.tsx) route — changes to it affect both.

Prefer server components; add `"use client"` only for hooks/browser APIs. Currently client-side: `Header`, `TacticalName`, `HeroTelemetry`, `DisplayAppToast`, and both display-app routes.

### Styling reality

The shadcn token layer in `globals.css` (`--background`, `--primary`, `.dark`, …) ships with the default light palette and is essentially **unused by the hand-written portfolio components**, which hardcode the tactical palette directly in Tailwind classes (`bg-black`, `text-blue-500`, `border-[#1e1e1e]`, `text-[#f0f0f0]`). Follow the surrounding components' hardcoded approach rather than trying to route new portfolio styles through the shadcn tokens.

Custom animations `animate-fade-in` / `animate-fade-up` are declared in `globals.css` — reuse them for entrance transitions.

## Design Theme

Tactical/military HUD aesthetic: black background, `blue-500` accent, drifting grid overlay + radial glow + vignette ([PageBackground.tsx](sebastianboscan/components/home/PageBackground.tsx)), monospace uppercase labels with wide `tracking-[0.25em]`-style letterspacing, corner-bracket borders, and `cursor: crosshair`. New sections and components should follow this visual language.

## Meta Ray-Ban Display App (`/display-app`)

A HUD-style portfolio served to Meta Ray-Ban Display glasses, per
[Meta's webapp docs](https://wearables.developer.meta.com/docs/develop/webapps/setup/).
Hard constraints enforced by the glasses runtime — keep these when editing the route:

- Fixed **600x600** viewport — set via the `viewport` export in [app/display-app/layout.tsx](sebastianboscan/app/display-app/layout.tsx)
- **Dark background only** (it disappears on the lens); high-contrast light text, body ≥16px
- Navigation is **arrow keys + Enter only** (Neural Band/captouch gestures map to those keys); no text input, camera, mic, or browser back
- Interactive elements need a minimum **88px** tap target height (`style={{ minHeight: 88 }}` in the existing views)
- Must be served over **HTTPS** (Vercel satisfies this)

Each display route is a single self-contained client component holding a `view` state machine plus a global `keydown` listener; sub-views are local function components in the same file. `/display-app/casino` is an easter-egg game collection following the same pattern.

The homepage shows [DisplayAppToast.tsx](sebastianboscan/components/home/DisplayAppToast.tsx), a dismissible banner gated on the `display-app-toast-dismissed` localStorage key.

## Metadata & Deployment

Base URL resolution in [app/layout.tsx](sebastianboscan/app/layout.tsx) follows this priority: `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → `http://localhost:3000`. OpenGraph image is `public/images/headshot.jpg`. Set `NEXT_PUBLIC_SITE_URL` for production deployments outside Vercel. Keep this resolution order intact when touching metadata or canonical URL logic.
