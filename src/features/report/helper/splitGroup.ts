import { ITEM_SPLIT_BY_CODE, ITEM_SPLIT_BY_NAME } from "../report.constant";
import type { ParsedReport } from "@/lib/xlsx/xlsx.type";

export const splitGroup = (items: ParsedReport[]) => {
  const grouped = {
    names: [] as ParsedReport[],
    codes: [] as ParsedReport[],
    others: [] as ParsedReport[],
  };

  for (const item of items) {
    if (item.name.match(new RegExp(ITEM_SPLIT_BY_NAME.join("|"), "gi"))) {
      grouped.names.push(item);
    } else if (
      item.code.match(new RegExp(ITEM_SPLIT_BY_CODE.join("|"), "gi"))
    ) {
      grouped.codes.push(item);
    } else {
      grouped.others.push(item);
    }
  }

  return [grouped.others, grouped.names, grouped.codes].filter(
    (group) => group.length > 0,
  );
};
