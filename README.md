# MNM Daily Report

Web app that turns the daily Excel stock sheet into the formatted "LAPORAN HARIAN STOCK LAYER PVC"
text report, merging in container / pre-order data (Supabase) and optional sales data (MPO).

**Stack:** React + TypeScript + Vite · Zustand · Supabase · SheetJS (`xlsx`) · Zod · Tailwind · Vercel.

## Getting started

```bash
pnpm install
cp .env.example .env      # then fill in the two values below
pnpm dev
```

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key |

The app refuses to start with a clear error if either is missing.

> **Security:** there is no login, and the anon key is visible in the browser bundle (normal for
> Supabase). Access control therefore depends entirely on **Row Level Security** policies on the
> orders table. Make sure they are enabled and restrictive.

```bash
pnpm test        # unit tests (Vitest)
pnpm build
```

## Where things live

```
src/
  constants/    ALL constants — one place (see below)
  types/        shared types
  apps/         Supabase client, service, schemas
  components/   reusable UI (Button, Modal, Toast, Spinner, ...)
  features/     orders · report · sales · stuffing
  libs/         xlsx parsing, fileStorage (IndexedDB)
  hooks/ stores/ utils/ pages/ layouts/ routes/
```

### `src/constants/`

| File | Contents |
| --- | --- |
| `App.ts` | routes, DB table, storage keys, localStorage keys, timings |
| `Items.ts` | item types (single source), categories + spelling aliases |
| `Order.ts` / `Sales.ts` | categories, tabs, containers, page sizes |
| `Report.ts` / `Date.ts` | report header; month / weekday names |
| `rules/` | product rules for the report (pure data) + validator |

Rule of thumb: if it is a literal that more than one file could need, it belongs here.

## How a report is built

```
Excel file ──► libs/xlsx (parses ONE sheet = day of month, cached per file)
           ──► features/report: createPair → splitGroup → mergeGroup → groupByCategory
           ──► + orders (Supabase) + sales (MPO)
           ──► features/report/dataToText ──► text to copy
```

* The uploaded file is kept in IndexedDB (`libs/fileStorage`) and restored on reload. If the browser
  can't store it, the app keeps working and shows a notification.
* `xlsx` and the other pages are loaded on demand / when the browser is idle.

## When a product shows up wrong in the report

Edit **`src/constants/rules/`** — it is pure data:

| File | Purpose |
| --- | --- |
| `report.rules.ts` | name fixes, split / merge rules, custom titles, variant labels |
| `sales.rules.ts` | sales name fixes and code groups |
| `validateRules.ts` | sanity checks, run by `constants/__tests__/rules.test.ts` |

Then add a case to `src/features/report/__tests__/pipeline.test.ts` so it stays fixed.
