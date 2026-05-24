import type { ItemTypeCode } from "@/app/constants";
import type { CATEGORY_KEYS } from "@/features/report/report.constant";

export interface ParsedReport {
  name: string;
  code: string;
  category: string;
  type: ItemTypeCode | "";
  size: string;
  weight: string;
  stock: string;
}

export interface ParsedSales {
  item: string;
  total: number;
  packing: string | undefined;
  code: string;
  category: string;
  monthlySale: number[];
}

export type GroupedCategories = Record<
  (typeof CATEGORY_KEYS)[number],
  ParsedReport[][]
>;

export type Contents = "report" | "sales";
