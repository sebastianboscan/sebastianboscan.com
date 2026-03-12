# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

The Next.js app lives in the `sebastianboscan/` subdirectory. All development commands must be run from there.

```
sebastianboscan.com/
└── sebastianboscan/       # Next.js app root
    ├── app/               # Next.js App Router (pages, layouts, global CSS)
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

## Metadata & Deployment

Base URL resolution in `app/layout.tsx` follows this priority: `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → `http://localhost:3000`. OpenGraph image is `public/images/headshot.jpg`. Set `NEXT_PUBLIC_SITE_URL` for production deployments outside Vercel.
