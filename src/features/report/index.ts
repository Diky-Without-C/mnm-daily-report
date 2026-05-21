import type { ParsedReport } from "@/lib/xlsx/xlsx.type";
import { createPair } from "@/features/report/helper/createPair";
import { groupByCategory } from "@/features/report/helper/groupByCathegory";
import { splitGroup } from "@/features/report/helper/splitGroup";
import { mergeGroup } from "@/features/report/helper/mergeGroup";

export const processData = (data: ParsedReport[]) => {
  const clean = data.filter((item) => item.type !== "");
  const pairs = createPair(clean);
  const split = pairs.flatMap((pair) => splitGroup(pair));
  const merge = mergeGroup(split);
  const categories = groupByCategory(merge);
  return categories;
};
