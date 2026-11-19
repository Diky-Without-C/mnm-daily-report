import type { ParsedReport } from "@libs/xlsx/xlsx.type";

export const ITEMS_TO_CLEAR = ["LOKAL"];

export type ItemToSplit = { code: string } | { name: string };

export const ITEM_TO_SPLIT: ItemToSplit[] = [
  { code: "MC522A" },
  { name: "MOTOCROSS METALIC" },
  { name: "SEPEDA MOTOR GP3 SABLON" },
  { code: "MD3461" },
  { code: "MC373S" },
  { code: "MD3675-S" },
  { code: "MC462S" },
  { code: "MC551" },
  { code: "DV001" },
  { code: "SR008-L" },
  { code: "SR008-P" },
  { code: "MD3488L" },
  { code: "SR002A" },
  { code: "DV021" },
  { code: "DV021-PB" },
  { code: "DV016" },
  { code: "DV016-PA" },
  { code: "DV016-PB" },
  { code: "DV018" },
  { code: "DV018-PA" },
  { code: "DV018-PB" },
  { code: "DV019" },
  { code: "MC412" },
  { code: "MC412S" },
  { code: "MC413" },
  { code: "MC413S" },
  { code: "MC523S" },
  { name: "GASING CARTOON (PORORO)" },
  { name: "FANCY GUESSING EGG BOX" },
  { code: "FC009S" },
  { code: "MC460" },
  { code: "FC007" },
  { code: "SP002" },
  { name: "ROBOMAN BLOCK (NINJA HERO)" },
  { code: "MC521S" },
  { code: "MC566S" },
  { code: "MC547S" },
  { code: "MC549S" },
  { code: "MC548S" },
  { code: "TS014" },
  { code: "TS015" },
  { code: "TS019" },
  { code: "TS020" },
  { code: "TS021" },
  { code: "TS022" },
] as const;

export type MergeRule = Partial<ParsedReport>;

export const ITEM_TO_MERGE: MergeRule[][] = [
  [{ code: "SR008-L" }, { code: "SR008-P" }],
  [{ code: "DV021" }, { code: "DV021-PB" }],
  [{ code: "DV016" }, { code: "DV016-PA" }, { code: "DV016-PB" }],
  [{ code: "DV018" }, { code: "DV018-PA" }, { code: "DV018-PB" }],
  [{ code: "MC460" }, { code: "MC460", type: "PVC" }],
  [{ code: "FC007" }, { code: "FC007", type: "PVC" }],
  [{ code: "MD3308" }, { code: "MC319" }],
  [{ code: "MC297/MC379" }, { code: "MC379" }],
];

/** "NAME (CODE)" title produced by default -> title shown in the report. */
export const CUSTOM_TITLES = {
  "ROBOMAN BLOCK MERAH (MC319-D)": "ROBOMAN BOX (MC319-BOX)",
  "ROBOMAN (RM019)": "ROBOMAN TACTICAL FORCE (RM019)",
  "MOBIL CARTOON HELI (MD3488)": "MOBIL CARTOON (MD3488)",
} as const;

/** Words in an item name used to label variants of the same product. */
export const EXTRA_INFO = [
  "Heli",
  "Pesawat",
  "Jeep",
  "Vw",
  "SNI",
  "Star Rider",
  "Merah",
  "Ungu",
  "Oren",
  "Kuning",
  "Hijau",
  "Biru",
  "Tosca",
  "Hitam",
  "Silver",
  "Putih",
  "Bening",
  "Kotak",
  "Bulat",
  "Hlk",
  "Captain",
  "BearBrick",
  "Master",
  "Shinobi",
  "Attack",
  "Dragon",
];

export type ExtraInfoKeyword = (typeof EXTRA_INFO)[number];
