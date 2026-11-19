import type { ParsedReport } from "@libs/xlsx/xlsx.type";

/**
 * Groups rows of the same product: same category AND (same short code OR same
 * name). Rows without a code / name never match on that field — otherwise
 * every code-less row of a category would collapse into a single group.
 */
export const groupItems = (
  items: ParsedReport[],
  by: "name" | "code" | "default" = "default",
): ParsedReport[][] => {
  const result: ParsedReport[][] = [];

  const nameGroups = new Map<string, ParsedReport[]>();
  const codeGroups = new Map<string, ParsedReport[]>();

  for (const item of items) {
    const nameKey = item.name;
    const [codeKey] = item.code.match(/\b(?:\D{2})\d{3,4}/i) ?? [item.code];

    const codeGroup = codeKey ? codeGroups.get(codeKey) : undefined;
    if (by === "code" || by === "default") {
      if (codeGroup) {
        codeGroup.push(item);
        continue;
      }
    }

    const nameGroup = nameKey ? nameGroups.get(nameKey) : undefined;
    if (by === "name" || by === "default") {
      if (nameGroup) {
        nameGroup.push(item);
        continue;
      }
    }

    const newGroup = [item];
    result.push(newGroup);

    if (nameKey) nameGroups.set(nameKey, newGroup);
    if (codeKey) codeGroups.set(codeKey, newGroup);
  }

  return result;
};
