import type { ItemTypeCode, ITEM_CATEGORIES } from "@constants/Items";

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
  (typeof ITEM_CATEGORIES)[number],
  ParsedReport[][]
>;

export type Contents = "report" | "sales";

export type ParserMap = {
  report: ParsedReport;
  sales: ParsedSales;
};
