import { itemToMerge } from "@constant/constant.json";
import type { Item } from "..";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findGroupIndex(groups: Map<number, Item[]>, item: Partial<Item>) {
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

export default function mergeGroup(groups: Item[][]): Item[][] {
  const groupMap = new Map<number, Item[]>();
  groups.forEach((group, i) => groupMap.set(i, group));

  for (const [search, ...targets] of itemToMerge) {
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
}
