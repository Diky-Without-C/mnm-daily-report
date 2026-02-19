import { ITEM_TO_MERGE } from "@/app/constants";
import type { ParsedItem } from "@/lib/xlsx/xlsx.type";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findGroupIndex(
  groups: Map<number, ParsedItem[]>,
  item: Partial<ParsedItem>,
) {
  const regex = item.code
    ? new RegExp(escapeRegex(item.code), "i")
    : item.name
      ? new RegExp(escapeRegex(item.name), "i")
      : null;

  if (!regex) return;

  for (const [index, group] of groups) {
    const ref = group[0];
    if (
      (item.code && regex.test(ref.code)) ||
      (item.name && regex.test(ref.name))
    ) {
      return index;
    }
  }
}

export const mergeGroup = (groups: ParsedItem[][]): ParsedItem[][] => {
  const groupMap = new Map<number, ParsedItem[]>();
  groups.forEach((group, i) => groupMap.set(i, group));

  for (const [search, ...targets] of ITEM_TO_MERGE) {
    const mainIndex = findGroupIndex(groupMap, search);
    if (mainIndex === undefined) continue;

    const targetIndexes = targets
      .map((target) => findGroupIndex(groupMap, target))
      .filter((i): i is number => i !== undefined && i !== mainIndex);

    if (targetIndexes.length !== targets.length) continue;

    const merged = [
      ...groupMap.get(mainIndex)!,
      ...targetIndexes.flatMap((i) => groupMap.get(i)!),
    ];

    groupMap.set(mainIndex, merged);
    targetIndexes.forEach((i) => groupMap.delete(i));
  }

  return [...groupMap.values()];
};
