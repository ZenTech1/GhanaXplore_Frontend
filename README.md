# GhanaXplore Frontend

Next.js (App Router) PWA per Section 9.1 of the project proposal.

## Stack

| Concern | Choice | Note |
|---|---|---|
| Framework | Next.js 14, App Router | |
| Styling | Tailwind CSS | tokens as CSS custom properties in `globals.css`, swap once Figma tokens land |
| i18n | `next-intl` | doc names `next-i18next`, which doesn't support the App Router — this covers the same requirement (NFR-7) |
| Offline storage | `idb` (IndexedDB wrapper) | see `src/lib/offline/db.ts` |
| PWA / service worker | `@ducanh2912/next-pwa` | App Router-compatible fork of `next-pwa` |
| Maps | `@react-google-maps/api` | ⚠️ confirm Google Maps ToS allows the offline tile caching in Section 9.3 before building on this — may need Mapbox instead |
| Client state | `zustand` | lightweight, no Redux boilerplate |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in API base URL, Maps key, Paystack public key
npm run dev
```

## Structure

```
src/
  app/[locale]/
    (tourist)/attractions, bookings      — public tourist-facing routes
    (auth)/login, register              — auth routes
    (operator)/dashboard                 — operator/SME routes (FR-39 to FR-42)
    layout.tsx                           — i18n provider, offline banner, global shell
  components/
    attractions/, booking/, offline/, layout/, ui/
  lib/
    api/        — typed fetch client + per-resource API modules
    offline/    — IndexedDB schema (db.ts) + sync manager (sync.ts)
  hooks/
    useOnlineStatus.ts
  types/
    index.ts    — domain types mirrored from Section 11 (Data Model)
  i18n/
    config.ts, request.ts
messages/
  en.json, fr.json  — add tw/ga/ee/ha as translations become available (NFR-7)
```

## What's real vs placeholder

- **Real, ready to build on:** the folder structure, i18n routing, the API client,
  the full IndexedDB offline schema + sync manager, and the TypeScript domain types.
- **Placeholder, swap once Figma is ready:** every `page.tsx` under `(tourist)`,
  `(auth)`, `(operator)` — these render minimal markup just to prove the route
  and data-fetching pattern. Color tokens in `globals.css` are also placeholders.

## Known open questions to raise with the team

1. **Google Maps offline caching** — Google's ToS restricts caching map tiles.
   Confirm this is acceptable, or budget time to swap to Mapbox before FR-8/FR-30
   work starts.
2. **iOS PWA limitations** — background sync and push notifications are limited
   on iOS Safari. Worth setting expectations with stakeholders on what "installable
   PWA" means per platform.
3. **Offline bundle assembly** — right now `DownloadOfflineButton` builds the bundle
   client-side from whatever fields the API already returns. Once the backend has
   a dedicated offline-bundle endpoint (pre-compressed images, food guide, language
   tips bundled server-side per FR-36/FR-37), swap that component to just fetch and
   cache the response instead of assembling it here.
