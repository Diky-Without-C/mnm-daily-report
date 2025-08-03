import type { Item } from "..";

export default function splitByType(items: Item[]) {
  const typeMap = new Map<string, Item[]>();

  for (const item of items) {
    if (!typeMap.has(item.type)) {
      typeMap.set(item.type, []);
    }
    typeMap.get(item.type)!.push(item);
  }

  return Array.from(typeMap.values());
}
