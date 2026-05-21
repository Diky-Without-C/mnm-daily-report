import type { ParsedReport } from "@/lib/xlsx/xlsx.type";

export const splitByType = (items: ParsedReport[]) => {
  const typeMap = new Map<string, ParsedReport[]>();

  for (const item of items) {
    if (!typeMap.has(item.type)) {
      typeMap.set(item.type, []);
    }
    typeMap.get(item.type)!.push(item);
  }

  return Array.from(typeMap.values());
};
