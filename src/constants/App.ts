/**
 * APP-WIDE CONSTANTS — every "magic string / number" of the app lives in
 * `src/constants/`. Map of this folder:
 *
 *   App.ts     routes, database table, storage keys, timings (this file)
 *   Date.ts    month / weekday names
 *   Items.ts   item types, categories (+ spelling aliases)
 *   Order.ts   order categories, containers, tabs, page size
 *   Report.ts  report text header
 *   Sales.ts   sales tabs, page size
 *   rules/     product rules for the report (pure data) + validator
 */

export const ROUTES = {
  home: "/",
  order: "/order",
  stuffing: "/stuffing",
  sales: "/sales",
  archive: "/archive",
} as const;

/** Supabase table that stores orders (both pre-order and container rows). */
export const DB_TABLES = {
  orders: "report",
} as const;

/** Keys under which uploaded Excel files are persisted. */
export const FILE_KEYS = {
  report: "mnm-xlsx-report-storage",
  sales: "mnm-xlsx-sales-storage",
} as const;

/** IndexedDB database that holds the uploaded Excel files. */
export const FILE_DB = {
  name: "mnm-xlsx-storage",
  version: 1,
  store: "files",
} as const;

export const LOCAL_STORAGE_KEYS = {
  codeHints: "codeHint",
} as const;

export const EXCEL_ACCEPT = ".xlsx,.xls,.xlsm";

/** How often the connection to Supabase is re-checked (ms). */
export const ONLINE_CHECK_INTERVAL_MS = 30_000;

/** How long the "copied" check mark stays visible (ms). */
export const COPY_FEEDBACK_MS = 1500;

/** How long each kind of toast stays on screen (ms). */
export const TOAST_DURATION_MS = {
  success: 3000,
  info: 4000,
  error: 6000,
} as const;
