import { itemTypes } from "@constant/constant.json";
import type { Item } from "..";

export interface GroupedCategories {
  star_rider: Item[][];
  fancy: Item[][];
  snipper: Item[][];
  roboman: Item[][];
}

export default function groupByCategory(items: Item[][]): GroupedCategories {
  const categories: GroupedCategories = {
    star_rider: [],
    fancy: [],
    snipper: [],
    roboman: [],
  };

  for (const group of items) {
    if (group.length === 0) continue;

    const sortedGroup = group.sort((a, b) => {
      const indexA = Object.values(itemTypes).indexOf(a.type);
      const indexB = Object.values(itemTypes).indexOf(b.type);
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
}
