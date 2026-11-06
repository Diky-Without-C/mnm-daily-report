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
} as const;

export type ItemTypeCode = keyof typeof ITEM_TYPES;
export type ItemTypeLabel = (typeof ITEM_TYPES)[ItemTypeCode];

/** Labels only ("Layer", "PVC", ...), as a tuple so it can feed `z.enum`. */
export const ITEM_TYPE_LABELS = Object.values(ITEM_TYPES) as unknown as readonly [
  ItemTypeLabel,
  ...ItemTypeLabel[],
];

/* =========================
 * CATEGORIES
 * ========================= */
export const ITEM_CATEGORIES = [
  "star rider",
  "fancy",
  "snipper",
  "roboman",
] as const;
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

/** Alternative spellings found in spreadsheets. Keys must be lower-case. */
export const CATEGORY_ALIASES: Readonly<Record<string, ItemCategory>> = {
  sniper: "snipper",
};
