import { CATEGORY_ALIASES, ITEM_CATEGORIES, type ItemCategory } from "@constants/Items";

/**
 * Maps a category as written in a spreadsheet ("SNIPER ", "Star Rider") to a
 * known category, or `undefined` when it is not one we report on.
 */
export const normalizeCategory = (
  category: string | null | undefined,
): ItemCategory | undefined => {
  const key = (category ?? "").trim().toLowerCase();
  const resolved = CATEGORY_ALIASES[key] ?? key;

  return (ITEM_CATEGORIES as readonly string[]).includes(resolved)
    ? (resolved as ItemCategory)
    : undefined;
};
