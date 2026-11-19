import type { ParsedReport } from "@libs/xlsx/xlsx.type";
import { type MergeRule } from "@constants/rules/report.rules";

/** Code: exact match. Name: case-insensitive contains. */
const matchesRule = (rule: MergeRule, item: ParsedReport): boolean => {
  return Object.entries(rule).every(([key, value]) => {
    const itemValue = item[key as keyof ParsedReport];

    return itemValue === value;
  });
};

function findGroupIndex(
  groups: Map<number, ParsedReport[]>,
  rule: MergeRule,
): number | undefined {
  for (const [index, group] of groups) {
    if (group.some((item) => matchesRule(rule, item))) return index;
  }
}

export const mergeGroup = (
  groups: ParsedReport[][],
  rules: MergeRule[][],
): ParsedReport[][] => {
  const groupMap = new Map(groups.map((group, i) => [i, group]));

  for (const [parent, ...children] of rules) {
    const mainIndex = findGroupIndex(groupMap, parent);

    if (mainIndex === undefined) continue;

    const targetIndexes = children.map((rule) =>
      findGroupIndex(groupMap, rule),
    );

    // Every child must exist and belong to a different group.
    if (
      targetIndexes.some((index) => index === undefined || index === mainIndex)
    ) {
      continue;
    }

    const merged = [
      ...groupMap.get(mainIndex)!,
      ...targetIndexes.flatMap((index) => groupMap.get(index!)!),
    ];

    groupMap.set(mainIndex, merged);

    targetIndexes.forEach((index) => groupMap.delete(index!));
  }

  return [...groupMap.values()];
};
