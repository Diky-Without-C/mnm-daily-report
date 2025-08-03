import { itemToSplitByCode, itemToSplitByName } from "@constant/constant.json";
import type { Item } from "..";

export default function splitGroup(items: Item[]) {
  const grouped = {
    names: [] as Item[],
    codes: [] as Item[],
    others: [] as Item[],
  };

  for (const item of items) {
    if (item.name.match(new RegExp(itemToSplitByName.join("|"), "gi"))) {
      grouped.names.push(item);
    } else if (item.code.match(new RegExp(itemToSplitByCode.join("|"), "gi"))) {
      grouped.codes.push(item);
    } else {
      grouped.others.push(item);
    }
  }

  return [grouped.others, grouped.names, grouped.codes].filter(
    (group) => group.length > 0,
  );
}
