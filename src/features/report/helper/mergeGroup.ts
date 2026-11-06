import type { ParsedReport } from "@libs/xlsx/xlsx.type";
import { ITEM_TO_MERGE, type MergeRule } from "@constants/rules/report.rules";

const normalizeCode = (code: string) => code.replace(/\s+/g, "").toUpperCase();

/** code rule: exact code match. name rule: case-insensitive "contains". */
const matchesRule = (rule: MergeRule, item: ParsedReport) =>
  "code" in rule
    ? normalizeCode(item.code) === normalizeCode(rule.code)
    : item.name.toLowerCase().includes(rule.name.toLowerCase());

function findGroupIndex(
  groups: Map<number, ParsedReport[]>,
  rule: MergeRule,
): number | undefined {
  for (const [index, group] of groups) {
    if (group.some((item) => matchesRule(rule, item))) return index;
  }
}

const findFirstIndex = (
  groups: Map<number, ParsedReport[]>,
  rules: MergeRule[],
) => {
  for (const rule of rules) {
    const index = findGroupIndex(groups, rule);
    if (index !== undefined) return index;
  }
};

export const mergeGroup = (groups: ParsedReport[][]): ParsedReport[][] => {
  const groupMap = new Map<number, ParsedReport[]>();
  groups.forEach((group, i) => groupMap.set(i, group));

  for (const { parent, child } of ITEM_TO_MERGE) {
    const mainIndex = findFirstIndex(groupMap, parent);
    if (mainIndex === undefined) continue;

    const targetIndexes = child
      .map((rule) => findGroupIndex(groupMap, rule))
      .filter((i): i is number => i !== undefined && i !== mainIndex);

    // Only merge when EVERY child was found.
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
