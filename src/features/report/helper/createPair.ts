import type { ParsedReport } from "@libs/xlsx/xlsx.type";
import { clearCode } from "../utils/clearCode";

/**
 * Groups rows of the same product: same category AND (same short code OR same
 * name). Rows without a code / name never match on that field — otherwise
 * every code-less row of a category would collapse into a single group.
 */
export const createPair = (items: ParsedReport[]): ParsedReport[][] => {
  const result: ParsedReport[][] = [];

  const nameGroups = new Map<string, ParsedReport[]>();
  const codeGroups = new Map<string, ParsedReport[]>();

  for (const item of items) {
    const nameKey = item.name;
    const codeKey = clearCode(item.code);
    const category = item.category;

    const codeGroup = codeKey ? codeGroups.get(codeKey) : undefined;
    if (codeGroup && codeGroup[0].category === category) {
      codeGroup.push(item);
      continue;
    }

    const nameGroup = nameKey ? nameGroups.get(nameKey) : undefined;
    if (nameGroup && nameGroup[0].category === category) {
      nameGroup.push(item);
      continue;
    }

    const newGroup = [item];
    result.push(newGroup);

    if (nameKey) nameGroups.set(nameKey, newGroup);
    if (codeKey) codeGroups.set(codeKey, newGroup);
  }

  return result;
};
