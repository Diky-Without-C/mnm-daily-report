import type { ParsedItem } from "@/lib/xlsx/xlsx.type";
import { clearCode } from "../utils/clearCode";

export const createPair = (items: ParsedItem[]): ParsedItem[][] => {
  const result: ParsedItem[][] = [];
  const visited = new Set<ParsedItem>();

  const nameGroups = new Map<string, ParsedItem[]>();
  const codeGroups = new Map<string, ParsedItem[]>();

  for (const item of items) {
    if (visited.has(item)) continue;

    const nameKey = item.name;
    const codeKey = clearCode(item.code);
    const category = item.category;

    const codeGroup = codeGroups.get(codeKey);
    if (codeGroup && codeGroup[0].category === category) {
      codeGroup.push(item);
      visited.add(item);
      continue;
    }

    const nameGroup = nameGroups.get(nameKey);
    if (nameGroup && nameGroup[0].category === category) {
      nameGroup.push(item);
      visited.add(item);
      continue;
    }

    const newGroup = [item];
    result.push(newGroup);
    visited.add(item);

    nameGroups.set(nameKey, newGroup);
    codeGroups.set(codeKey, newGroup);
  }

  return result;
};
