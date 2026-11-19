import type { ItemToSplit } from "@constants/rules/report.rules";
import type { ParsedReport } from "@libs/xlsx/xlsx.type";

export const splitGroup = (
  groups: ParsedReport[][],
  splitItems: ItemToSplit[],
): ParsedReport[][] => {
  const result: ParsedReport[][] = [];

  for (const group of groups) {
    const matched = new Map<string, ParsedReport[]>();
    const unmatched: ParsedReport[] = [];

    for (const item of group) {
      const rule = splitItems.find((rule) => {
        if ("name" in rule) return item.name === rule.name;
        if ("code" in rule) return item.code === rule.code;
        return false;
      });

      if (!rule) {
        unmatched.push(item);
        continue;
      }

      const key = "name" in rule ? `name:${rule.name}` : `code:${rule.code}`;
      const items = matched.get(key) ?? [];

      items.push(item);
      matched.set(key, items);
    }

    if (unmatched.length) result.push(unmatched);

    result.push(...matched.values());
  }

  return result;
};
