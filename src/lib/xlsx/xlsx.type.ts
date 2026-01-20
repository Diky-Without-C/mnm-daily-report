import type { ItemTypeCode } from "@/app/constants";
import type { CATEGORY_KEYS } from "@/features/report/report.constant";

export interface ParsedItem {
  name: string;
  code: string;
  category: string;
  type: ItemTypeCode | "";
  size: string;
  weight: string;
  stock: string;
}

export type GroupedCategories = Record<
  (typeof CATEGORY_KEYS)[number],
  ParsedItem[][]
>;
