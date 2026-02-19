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
  "MOTO CROSS METALIC",
  "SEPEDA MOTOR GP3 SABLON",
  "FANCY GUESSING EGG BOX",
] as const;

export const ITEM_SPLIT_BY_CODE = [
  "522A",
  "MD3461",
  "462S",
  "373S",
  "3675-S",
  "3488L",
  "551S",
  "412S",
  "413S",
  "523S",
  "536L",
  "460L2",
  "FC009S",
  "319-D",
  "521S",
  "566S",
  "547S",
  "549S",
  "548S",
] as const;

/* =========================
 * MERGE RULES
 * ========================= */
export type MergeRule = { code: string } | { name: string };

export const ITEM_TO_MERGE: ReadonlyArray<ReadonlyArray<MergeRule>> = [
  [{ code: "MD3308" }, { code: "MC319-D" }],
  [{ code: "MC351" }, { code: "MC530" }],
  [{ code: "MC309" }, { code: "MC336" }],
  [{ name: "ROBOMAN BLOCK (BATMAN)" }, { name: "ROBOMAN BLOCK (IRONMAN)" }],
];

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
];

export type ExtraInfoKeyword = (typeof EXTRA_INFO)[number];

/* =========================
 * CUSTOM TITLES
 * ========================= */

export const CUSTOM_TITLES = {
  "ROBOMAN BLOCK MERAH (MC319-D)": "ROBOMAN BOX (MC319)",
  "ROBOMAN (RM019)": "ROBOMAN TACTICAL FORCE (RM019)",
  "MOBIL CARTOON HELI (MD3488)": "MOBIL CARTOON (MD3488)",
} as const;
