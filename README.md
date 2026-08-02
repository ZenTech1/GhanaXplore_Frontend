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
