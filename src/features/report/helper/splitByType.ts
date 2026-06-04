export const splitByType = <T extends { type: string }>(items: T[]) => {
  const typeMap = new Map<string, T[]>();

  for (const item of items) {
    if (!typeMap.has(item.type)) {
      typeMap.set(item.type, []);
    }
    typeMap.get(item.type)!.push(item);
  }

  return Array.from(typeMap.values());
};
