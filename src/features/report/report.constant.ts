export const HEADER = "LAPORAN HARIAN STOCK LAYER PVC";

export const ITEMS_TO_CLEAR = ["LOKAL"];

//replace item name before grouping for item that cannot be grouped by code or name
export const ITEMS_TO_REPLACE = {
  "BEYBLADE MC277": "277 - MC277",
  "BEYBLADE MC412": "412 - MC412",
  "BEYBLADE MC412-S": "412-S - MC412-S",
  "BEYBLADE MC413": "413 - MC413",
  "BEYBLADE MC413-L2": "413-l2 - MC413-L2",
  "TUMBLING CAR MC551": "MOBIL TUMBLING CAR MC551",
  "TUMBLING CAR (S) MC551S": "MOBIL TUMBLING CAR (S) MC551S",
  "DINOSAURUS WORLD SERIES MC460": "DINOSAURUS SERIES MC460",
  "THE MONSTER FC007": "THE MONSTER LABUBU FC007",
  "ROBOMAN BLOCK MC319 -": "ROBOMAN BLOCK MC319-D -",
  " MOTO CROSS METALIC MC522": " MOTO CROSS METALIC MC522M",
  " SEPEDA MOTOR GP9 MC288": " SEPEDA MOTOR GP9 MC288AB",
};

export const CATEGORY_KEYS = [
  "star_rider",
  "fancy",
  "snipper",
  "roboman",
] as const;

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
  "SR007-L",
] as const;

//custom merge rules for items that cannot be automatically grouped by code or name
export type MergeRule = { code: string } | { name: string };

export const ITEM_TO_MERGE: ReadonlyArray<{
  parent: MergeRule[];
  child: MergeRule[];
}> = [
  { parent: [{ code: "MD3308" }], child: [{ code: "MC319-D" }] },
  { parent: [{ code: "MC351" }], child: [{ code: "MC530" }] },
  {
    parent: [{ code: "MC583/RM005/RM014" }],
    child: [
      { name: "ROBOMAN BLOCK (DRAGON BALL) P" },
      { name: "ROBOMAN BLOCK SHINOBI BLOCK" },
    ],
  },
  { parent: [{ code: "MC309" }], child: [{ code: "MC336" }] },
  {
    parent: [{ name: "ROBOMAN BLOCK (BATMAN)" }],
    child: [{ name: "ROBOMAN BLOCK (IRONMAN)" }],
  },
];
