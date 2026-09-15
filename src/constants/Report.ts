export const ITEM_TYPES = [
  "Layer",
  "PVC",
  "OPP",
  "Bag",
  "Label",
  "Display",
  "Box",
  "Stiker",
  "Tray",
  "Kartu",
] as const;
export type ItemTypes = (typeof ITEM_TYPES)[number];

export const ITEM_TYPES_KEY = [
  "LYR",
  "PVC",
  "OPP",
  "BAG",
  "LBL",
  "DPY",
  "BOX",
  "STC",
  "TRY",
  "KRT",
] as const;
export type ItemTypesKey = (typeof ITEM_TYPES_KEY)[number];

export const ITEM_CATEGORY = [
  "star rider",
  "fancy",
  "sniper",
  "roboman",
] as const;
export type ItemCategory = (typeof ITEM_CATEGORY)[number];
