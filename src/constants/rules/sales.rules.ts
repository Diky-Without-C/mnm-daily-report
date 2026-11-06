/**
 * SALES RULES — data only. Same matching semantics as `ITEMS_TO_REPLACE` in
 * `report.rules.ts` (case-sensitive substring, longest key wins, single pass).
 */

/** Raw sales item text -> corrected text, applied before code extraction. */
export const SALES_ITEMS_TO_REPLACE = {
  "METALIC MC 522": "METALIC MC 522M",
  "BIKE SE MC 204": "BIKE SE MC 241",
  "MC 298": "MC 298A",
  "MC 288 (10X9)": "MC 288AB (10X9)",
  "MC 462 (72)": "MC 462S (72)",
  "MD 3675 (72)": "MD 3675-S (72)",
  "MD 3669-3739": "MD 3669",
  "MC 412-S": "MC 412S",
  "MC 413 (72)": "MC 413S (72)",
  "MC 523-S": "MC 523S",
  "MC 459-A": "MC 459A",
  "MC 460-L2": "MC 460L2",
  "MC 282AB": "MC 282",
  "MC 373": "MC 373S",
  "SR 008-S": "SR 008-L",
  "SR 007": "SR 007-L",
  "SR 021": "SR 021-L",
  "GO PLUS KARTU MC 297": "GO PLUS KARTU MC 297-K",
  "MD 3385": "MC 319-BOX",
  "MC 550-A": "MC 550A",
  "MC 550-B": "MC 550B",
} as const;

/** Several product codes that share one stock line in the report. */
export const CODE_GROUPS = {
  MC297: "MC297/MC379",
  MC379: "MC297/MC379",
  MC521A: "MC521A",
  MC521B: "MC521A",
  MC550A: "MC550A",
  MC550B: "MC550A",
} as const;
