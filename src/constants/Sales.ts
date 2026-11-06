import { ITEM_CATEGORIES, type ItemCategory } from "./Items";

export type SalesTab = "all" | ItemCategory;
export const SALES_TABS: SalesTab[] = ["all", ...ITEM_CATEGORIES];

export const SALES_ITEMS_PER_PAGE = 7;
