import type { ParsedSales } from "@libs/xlsx/xlsx.type";
import type { SalesTab } from "@constants/Sales";

export interface ProcessedSale extends ParsedSales {
  last3MonthSales: number[];
}

export type SalesTabs = SalesTab;
