import { ITEM_TYPES } from "@/app/constants";
import { CATEGORY_KEYS } from "../xlsx.constant";
import type { GroupedCategories, ParsedItem } from "../xlsx.type";

export const groupByCategory = (items: ParsedItem[][]): GroupedCategories => {
  const categories: GroupedCategories = CATEGORY_KEYS.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as GroupedCategories);

  for (const group of items) {
    if (group.length === 0) continue;

    const sortedGroup = group.sort((a, b) => {
      const indexA = Object.keys(ITEM_TYPES).indexOf(a.type);
      const indexB = Object.keys(ITEM_TYPES).indexOf(b.type);
      return indexA - indexB;
    });

    const category = sortedGroup[0].category?.toLowerCase();

    switch (category) {
      case "star rider":
        categories.star_rider.push(sortedGroup);
        break;
      case "fancy":
        categories.fancy.push(sortedGroup);
        break;
      case "snipper":
        categories.snipper.push(sortedGroup);
        break;
      case "roboman":
        categories.roboman.push(sortedGroup);
        break;
    }
  }

  return categories;
};
