import { ITEM_TYPES, ITEM_CATEGORIES } from "@constants/Items";
import type { GroupedCategories, ParsedReport } from "@libs/xlsx/xlsx.type";
import { normalizeCategory } from "../utils/normalizeCategory";

const TYPE_ORDER = Object.keys(ITEM_TYPES);

const byTypeOrder = (a: ParsedReport, b: ParsedReport) =>
  TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);

export const groupByCategory = (items: ParsedReport[][]): GroupedCategories => {
  const categories = ITEM_CATEGORIES.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as GroupedCategories);

  const unknown = new Set<string>();

  for (const group of items) {
    if (group.length === 0) continue;

    const sortedGroup = [...group].sort(byTypeOrder);
    const rawCategory = sortedGroup[0].category;
    const category = normalizeCategory(rawCategory);

    if (!category) {
      unknown.add(rawCategory);
      continue;
    }

    categories[category].push(sortedGroup);
  }

  if (unknown.size > 0) {
    // Previously these items vanished from the report without any trace.
    console.warn(
      `[report] Skipped items with unknown category: ${[...unknown]
        .map((c) => JSON.stringify(c))
        .join(", ")}`,
    );
  }

  return categories;
};
