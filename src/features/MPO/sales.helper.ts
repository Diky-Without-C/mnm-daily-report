import type { ParsedSales } from "@/lib/xlsx/xlsx.type";
import { capitalize } from "@/utils/capitalize";
import { LAST_3_MONTHS } from "./sales.constant";

export interface ProcessedSale extends ParsedSales {
  last3MonthSales: number[];
  total3MonthSales: number;
}

export interface PlaceholderSale {
  item: string;
  last3MonthSales: number[];
  total3MonthSales: number;
}

export type DisplayedSale = ProcessedSale | PlaceholderSale;

export const processingSales = (
  selectedSales: ParsedSales[],
): DisplayedSale[] => {
  const processedSales: ProcessedSale[] = selectedSales
    .map((item) => {
      const last3MonthSales = LAST_3_MONTHS.map(
        (month) => item.monthlySale[month.index] || 0,
      );

      return {
        ...item,
        last3MonthSales,
        total3MonthSales: last3MonthSales.reduce(
          (sum, value) => sum + value,
          0,
        ),
      };
    })
    .filter((item) => item.total3MonthSales > 0)
    .sort((a, b) => b.total3MonthSales - a.total3MonthSales);

  return processedSales;
};

export const groupingSales = (sales: ParsedSales[][]) => {
  const grouped = sales.reduce(
    (acc, sale) => {
      const key = categoryToKey(sale[0].category);
      acc[key] ??= [];
      acc[key].push(...sale);

      return acc;
    },
    {} as Record<string, (typeof sales)[number]>,
  );

  const mergedGroup: Record<string, (typeof sales)[number]> = {
    all: sales.flat(),
    ...grouped,
  };

  return mergedGroup;
};

export const paginate = <T>(items: T[], page: number, perPage: number) => {
  const start = (page - 1) * perPage;

  return items.slice(start, start + perPage);
};

export const categoryToKey = (value: string) =>
  value.toLowerCase().replace(/\s+/g, "_");

export const keyToLabel = (value: string) =>
  capitalize(value.replace(/_/g, " "));
