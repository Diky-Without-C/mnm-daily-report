/* =========================
 * ITEM TYPES
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

/* =========================
 * CONTAINER TYPES
 * ========================= */
export const CONTAINER_TYPES = ["MC", "MF", "LOKAL"] as const;
export type ContainerType = (typeof CONTAINER_TYPES)[number];
