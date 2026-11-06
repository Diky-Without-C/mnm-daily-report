/**
 * REPORT RULES — data only, no logic, no app imports.
 *
 * Everything here exists because the Excel sheet cannot be grouped
 * automatically for a few products. When a new product shows up wrong in the
 * report, this is the only file that should need editing.
 * `validateRules.ts` + `rules.test.ts` guard against obvious mistakes.
 */

/** Tokens removed from the raw item string before parsing. */
export const ITEMS_TO_CLEAR = ["LOKAL"];

/**
 * Raw item text -> corrected item text, applied BEFORE grouping.
 * Matching is a plain, case-sensitive substring match. When several keys could
 * match at the same position the LONGEST key wins (so a "-S" / "-L2" variant
 * can be listed next to its base product safely), and replaced text is never
 * re-scanned by another rule.
 * Note: a value that contains its own key (e.g. "MC 298" -> "MC 298A") will be
 * applied again if the sheet already contains the corrected text.
 */
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

/** Items whose NAME contains one of these are split into their own group. */
export const ITEM_SPLIT_BY_NAME = [
  "MOTO CROSS METALIC",
  "SEPEDA MOTOR GP3 SABLON",
  "FANCY GUESSING EGG BOX",
] as const;

/** Items whose CODE contains one of these are split into their own group. */
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

/**
 * Merge rules: the group matching `parent` absorbs the groups matching every
 * `child` (all children must be found, otherwise the rule is skipped).
 *  - `{ code }` matches a group containing an item with EXACTLY that code
 *    (ignoring case and whitespace).
 *  - `{ name }` matches a group containing an item whose name CONTAINS that
 *    text (ignoring case).
 */
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
  "BearBrick",
  "Master",
  "Shinobi",
  "Attack",
  "Dragon",
];

export type ExtraInfoKeyword = (typeof EXTRA_INFO)[number];
