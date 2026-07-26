import type { ParsedReport } from "@libs/xlsx/xlsx.type";
import { ITEM_TO_MERGE } from "../report.constant";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findGroupIndex(
  groups: Map<number, ParsedReport[]>,
  item: Partial<ParsedReport>,
) {
  const regex = item.code
    ? new RegExp(escapeRegex(item.code), "i")
    : item.name
      ? new RegExp(escapeRegex(item.name), "i")
      : null;

  if (!regex) return;

  for (const [index, group] of groups) {
    const isMatch = group.some((ref) => {
      return (
        (item.code && regex.test(ref.code)) ||
        (item.name && regex.test(ref.name))
      );
    });

    if (isMatch) return index;
  }
}

const findFirstIndex = (
  groupMap: Map<number, ParsedReport[]>,
  items: Partial<ParsedReport>[],
) => {
  return items
    .map((item) => findGroupIndex(groupMap, item))
    .find((i) => i !== undefined);
};

export const mergeGroup = (groups: ParsedReport[][]): ParsedReport[][] => {
  const groupMap = new Map<number, ParsedReport[]>();
  groups.forEach((group, i) => groupMap.set(i, group));

  for (const { parent, child } of ITEM_TO_MERGE) {
    const mainIndex = findFirstIndex(groupMap, parent);
    if (mainIndex === undefined) continue;

    const targetIndexes = child
      .map((c) => findGroupIndex(groupMap, c))
      .filter((i): i is number => i !== undefined && i !== mainIndex);

    if (targetIndexes.length !== child.length) continue;

    const merged = [
      ...groupMap.get(mainIndex)!,
      ...targetIndexes.flatMap((i) => groupMap.get(i)!),
    ];

    groupMap.set(mainIndex, merged);
    targetIndexes.forEach((i) => groupMap.delete(i));
  }

  return [...groupMap.values()];
};
