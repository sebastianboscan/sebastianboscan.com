# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

The Next.js app lives in the `sebastianboscan/` subdirectory. **All commands must be run from there**, not the repo root.

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
                 # note: the script is bare `eslint` â pass paths to lint a subset
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

Practically, the palette is spread across ~23 hand-written files as literal Tailwind classes,
so a palette change means sweeping those literals — there is no single token to flip.

The accent is **monochrome**: `text-white` / `text-gray-200` for bright or active text,
`text-gray-400` / `text-gray-500` for labels and secondary text, `border-white/20`–`/60` for
borders, and white glows via `shadow-[0_0_Npx_rgba(255,255,255,a)]`. Brightness alone encodes
hierarchy now that hue is gone — when adding an active/inactive or primary/secondary pair, make
the important one *lighter*, and don't introduce a hue for emphasis.

Deliberate exceptions, which are semantic rather than decorative and should stay colored:
`yellow-*`/`red-*`/`green-*` for status, destructive actions, and success, plus the whole
`/display-app/casino` easter egg where color is part of the game.

Note: Tailwind arbitrary values cannot contain spaces — write `rgba(255,255,255,0.4)` inside
`shadow-[...]`, never `rgba(255, 255, 255, 0.4)`, or the class silently fails to compile.

## Design Theme

Tactical/military HUD aesthetic, pared back to minimalist monochrome: flat black background, white/gray accent, monospace uppercase labels with wide `tracking-[0.25em]`-style letterspacing, and `cursor: crosshair`. New sections and components should follow this visual language.

The homepage hero is deliberately sparse — name, rotating role, and three outline-only links on flat black. The animated grid canvas, the hero corner reticle brackets, the coordinate/clock telemetry readout, and the gradient divider under the name were all removed; don't reintroduce them as "tactical" decoration without asking.

## Meta Ray-Ban Display App (`/display-app`)

A HUD-style portfolio served to Meta Ray-Ban Display glasses, per
[Meta's webapp docs](https://wearables.developer.meta.com/docs/develop/webapps/setup/).
Hard constraints enforced by the glasses runtime — keep these when editing the route:

- Fixed **600x600** viewport — set via the `viewport` export in [app/display-app/layout.tsx](sebastianboscan/app/display-app/layout.tsx)
- **Dark background only** (it disappears on the lens); high-contrast light text, body ≥16px — keep body text at `gray-300` or lighter; mid-grays wash out on the lens
- Navigation is **arrow keys + Enter only** (Neural Band/captouch gestures map to those keys); no text input, camera, mic, or browser back
- Interactive elements need a minimum **88px** tap target height (`style={{ minHeight: 88 }}` in the existing views)
- Must be served over **HTTPS** (Vercel satisfies this)

Each display route is a single self-contained client component holding a `view` state machine plus a global `keydown` listener; sub-views are local function components in the same file. `/display-app/casino` is an easter-egg game collection following the same pattern.

The homepage shows [DisplayAppToast.tsx](sebastianboscan/components/home/DisplayAppToast.tsx), a dismissible banner gated on the `display-app-toast-dismissed` localStorage key.

## Local-only admin panel (`/admin`)

A development-only authoring tool that **rewrites `components/home/content.ts` on disk**.
It is not part of the deployed site and is guarded in three places â keep all three when editing:

- [app/admin/page.tsx](sebastianboscan/app/admin/page.tsx) calls `notFound()` unless `NODE_ENV === "development"`
- Every server action in [actions.ts](sebastianboscan/app/admin/actions.ts) runs `assertDevOnly()` before touching the filesystem
- The page sets `dynamic = "force-dynamic"` and `robots: { index: false, follow: false }`

[contentFile.ts](sebastianboscan/app/admin/contentFile.ts) does append/update/delete/reorder by
string-manipulating the source file, mapping each `EntryKind` (`experience` | `project` |
`organization`) to its const array name. Values are escaped for TS string literals before
embedding. Because both the homepage and `/display-app` read `content.ts`, writes call
`revalidatePath` on `/`, `/display-app`, and `/admin`.

If you change the shape of the entry arrays in `home/content.ts`, update the matching
`*Input` types and serializers in `contentFile.ts` â they are hand-written, not derived.

## Metadata & Deployment

Base URL resolution in [app/layout.tsx](sebastianboscan/app/layout.tsx) follows this priority: `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → `http://localhost:3000`. OpenGraph image is `public/images/headshot.jpg`. Set `NEXT_PUBLIC_SITE_URL` for production deployments outside Vercel. Keep this resolution order intact when touching metadata or canonical URL logic.
