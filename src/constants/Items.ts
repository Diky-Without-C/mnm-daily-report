/* =========================
 * ITEM TYPES  (code -> label) — the single source of truth
 * ========================= */
export const ITEM_TYPES = {
  LYR: "Layer",
  PVC: "PVC",
  OPP: "OPP",
  BAG: "Bag",
  LBL: "Label",
  DPY: "Display",
  BOX: "Box",
  STC: "Stiker",
  TRY: "Tray",
  KRT: "Kartu",
  BSR: "Brosur",
} as const;

export type ItemTypeCode = keyof typeof ITEM_TYPES;
export type ItemTypeLabel = (typeof ITEM_TYPES)[ItemTypeCode];

/** Labels only ("Layer", "PVC", ...), as a tuple so it can feed `z.enum`. */
export const ITEM_TYPE_LABELS = Object.values(
  ITEM_TYPES,
) as unknown as readonly [ItemTypeLabel, ...ItemTypeLabel[]];

/* =========================
 * CATEGORIES
 * ========================= */
export const ITEM_CATEGORIES = [
  "star rider",
  "fancy",
  "snipper",
  "roboman",
  "tosi",
] as const;
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];
