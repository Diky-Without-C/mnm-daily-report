import { ITEM_TO_MERGE, ITEM_TO_SPLIT } from "@constants/rules/report.rules";
import { groupItems } from "@features/report/helper/groupItem";
import { groupByCategory } from "@features/report/helper/groupByCategory";
import { splitGroup } from "@features/report/helper/splitGroup";
import { mergeGroup } from "@features/report/helper/mergeGroup";
import type { ParsedReport } from "@libs/xlsx/xlsx.type";

export const processData = (data: ParsedReport[]) => {
  const clean = data.filter((item) => item.type !== "");
  const groups = groupItems(clean, "default");
  const split = splitGroup(groups, ITEM_TO_SPLIT);
  const merge = mergeGroup(split, ITEM_TO_MERGE);
  const categories = groupByCategory(merge);

  return categories;
};
