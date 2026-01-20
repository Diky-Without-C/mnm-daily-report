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
 * SPLIT RULES
 * ========================= */
export const ITEM_SPLIT_BY_NAME = [
  "\\(S\\)",
  "ROBOMAN AP",
  "ROBOMAN SUPER HERO SERIES",
  "GASING CARTOON PORORO",
  "MOTOR CROSS METALIC",
] as const;

export const ITEM_SPLIT_BY_CODE = [
  "522A",
  "MC288AB",
  "MD3488L",
  "FC006",
  "MC568-DB",
  "MC568-B2",
  "MC412-S",
  "MC413-L2",
] as const;

/* =========================
 * MERGE RULES
 * ========================= */
export type MergeRule = { code: string } | { name: string };

export const ITEM_TO_MERGE: ReadonlyArray<ReadonlyArray<MergeRule>> = [
  [{ code: "MD3308-7" }, { name: "ROBOMAN MERAH" }],
  [{ code: "MC351" }, { code: "MC530" }],
  [{ name: "ROBOMAN BTM" }, { name: "ROBOMAN IRM" }],
];

/* =========================
 * EXTRA INFO KEYWORDS
 * ========================= */
export const EXTRA_INFO = [
  "Gunung",
  "Lipat",
  "Heli",
  "Pesawat",
  "Geep",
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
  "Irm",
  "Bear",
  "Master",
];

export type ExtraInfoKeyword = (typeof EXTRA_INFO)[number];

/* =========================
 * CUSTOM TITLES
 * ========================= */

export const CUSTOM_TITLES = {
  "ROBOMAN MERAH (MC319)": "ROBOMAN BOX (MC319)",
  "ROBOMAN (RM019)": "ROBOMAN TACTICAL FORCE (RM019)",
  "MOBIL CARTOON HELI (MD3488)": "MOBIL CARTOON (MD3488)",
} as const;
