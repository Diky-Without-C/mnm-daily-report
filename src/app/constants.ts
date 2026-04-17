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

/* =========================
 * EXTRA INFO KEYWORDS
 * ========================= */
export const EXTRA_INFO = [
  "Heli",
  "Pesawat",
  "Jeep",
  "Vw",
  "SNI",
  "Star Rider",
  "Merah",
  "Kuning",
  "Hijau",
  "Biru",
  "Hitam",
  "Putih",
  "Bening",
  "Kotak",
  "Bulat",
  "Hlk",
  "Captain",
  "Bear",
  "Master",
  "Shinobi",
  "Attack",
  "Dragon",
];

export type ExtraInfoKeyword = (typeof EXTRA_INFO)[number];

/* =========================
 * CUSTOM TITLES
 * ========================= */

export const CUSTOM_TITLES = {
  "ROBOMAN BLOCK MERAH (MC319-D)": "ROBOMAN BOX (MC319-BOX)",
  "ROBOMAN (RM019)": "ROBOMAN TACTICAL FORCE (RM019)",
  "MOBIL CARTOON HELI (MD3488)": "MOBIL CARTOON (MD3488)",
} as const;
