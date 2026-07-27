import type { ParsedSales } from "@libs/xlsx/xlsx.type";

export interface ProcessedSale extends ParsedSales {
  last3MonthSales: number[];
}
