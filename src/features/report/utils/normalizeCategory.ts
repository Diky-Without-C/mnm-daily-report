import { ITEM_CATEGORIES, type ItemCategory } from "@constants/Items";

/**
 * Maps a category as written in a spreadsheet ("SNIPER ", "Star Rider") to a
 * known category, or `undefined` when it is not one we report on.
 */
export const normalizeCategory = (
  category: string | null | undefined,
): ItemCategory | undefined => {
  const resolved = (category ?? "").trim().toLowerCase();

  return (ITEM_CATEGORIES as readonly string[]).includes(resolved)
    ? (resolved as ItemCategory)
    : undefined;
};
