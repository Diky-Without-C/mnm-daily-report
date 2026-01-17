import type { ParsedItem } from "../xlsx.type";

export const splitByType = (items: ParsedItem[]) => {
  const typeMap = new Map<string, ParsedItem[]>();

  for (const item of items) {
    if (!typeMap.has(item.type)) {
      typeMap.set(item.type, []);
    }
    typeMap.get(item.type)!.push(item);
  }

  return Array.from(typeMap.values());
};
