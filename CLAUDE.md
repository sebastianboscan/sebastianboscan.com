# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

The Next.js app lives in the `sebastianboscan/` subdirectory. All development commands must be run from there.

```
sebastianboscan.com/
└── sebastianboscan/       # Next.js app root
    ├── app/               # Next.js App Router (pages, layouts, global CSS)
    │   └── display-app/   # Meta Ray-Ban Display webapp (own layout/viewport)
    ├── components/
    │   ├── ui/            # shadcn/ui component library (do not modify directly)
    │   └── TacticalName.tsx  # Custom animated name component
    └── public/            # Static assets
```

## Commands

All commands run from `sebastianboscan/`:

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## Tech Stack

- **Next.js 16** with App Router and TypeScript
- **Tailwind CSS v4** — configured via `postcss.config.mjs`; CSS variables defined in `app/globals.css`
- **shadcn/ui** — pre-built Radix UI components in `components/ui/`; add new ones via the shadcn CLI rather than editing manually
- **Geist** font family (Sans + Mono) loaded via `next/font/google`

## Design Theme

The site uses a tactical/military HUD aesthetic: black background, blue accent color (`blue-500`), grid overlays, monospace-style uppercase labels, and `cursor: crosshair`. New sections and components should follow this visual language.

## Meta Ray-Ban Display App (`/display-app`)

A HUD-style portfolio served to Meta Ray-Ban Display glasses, per
[Meta's webapp docs](https://wearables.developer.meta.com/docs/develop/webapps/setup/).
Hard constraints enforced by the glasses runtime — keep these when editing the route:

- Fixed **600x600** viewport — set via the `viewport` export in `app/display-app/layout.tsx`
- **Dark background only** (it disappears on the lens); high-contrast light text, body ≥16px
- Navigation is **arrow keys + Enter only** (Neural Band/captouch gestures map to those keys);
  no text input, camera, mic, or browser back
- Interactive elements need a minimum **88px** tap target height
- Must be served over **HTTPS** (Vercel satisfies this)

The homepage shows `components/home/DisplayAppToast.tsx`, a dismissible
banner (localStorage-gated) pointing visitors to the route.

## Metadata & Deployment

Base URL resolution in `app/layout.tsx` follows this priority: `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → `http://localhost:3000`. OpenGraph image is `public/images/headshot.jpg`. Set `NEXT_PUBLIC_SITE_URL` for production deployments outside Vercel.
