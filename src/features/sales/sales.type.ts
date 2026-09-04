import type { ParsedSales } from "@libs/xlsx/xlsx.type";
import { CATEGORY_KEYS } from "@features/report/report.constant";

export interface ProcessedSale extends ParsedSales {
  last3MonthSales: number[];
}

export type SalesFilter = Record<string, Record<string, boolean>>;

export type SalesSort = "monthly-asc" | "monthly-desc";

export type SalesTabs =
  | (typeof CATEGORY_KEYS)[keyof typeof CATEGORY_KEYS]
  | "all";
