import type { ParsedSales } from "@libs/xlsx/xlsx.type";

export interface ProcessedSale extends ParsedSales {
  last3MonthSales: number[];
}

export type SalesFilter = {
  category: Record<string, boolean>;
};

export type SalesSort = "monthly-asc" | "monthly-desc";
