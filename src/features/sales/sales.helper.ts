import type { ParsedSales } from "@libs/xlsx/xlsx.type";
import { capitalize } from "@utils/capitalize";
import { LAST_3_MONTHS } from "./sales.constant";
import type { ProcessedSale } from "./sales.type";

export const processingSales = (selectedSales: ParsedSales[]) => {
  const processedSales: ProcessedSale[] = selectedSales
    .map((item) => {
      const last3MonthSales = LAST_3_MONTHS().map(
        (month) => item.monthlySale[month.index] || 0,
      );

      return {
        ...item,
        last3MonthSales,
      };
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);

  return processedSales;
};

export const groupingSales = (sales: ParsedSales[][]) => {
  const grouped = sales.reduce(
    (acc, sale) => {
      const firstItem = sale?.[0];

      if (!firstItem) return acc;

      const key = categoryToKey(String(firstItem.category));

      acc[key] ??= [];
      acc[key].push(...sale);

      return acc;
    },
    {} as Record<string, ParsedSales[]>,
  );

  return {
    all: sales.flat().filter(Boolean),
    ...grouped,
  } as Record<string, ParsedSales[]>;
};

export const createEmptySales = (count: number): ProcessedSale[] => {
  return Array.from({ length: count }).map((_, index) => ({
    item: String(index),
    packing: undefined,
    category: "",
    code: "",
    monthlySale: [],
    last3MonthSales: LAST_3_MONTHS().map(() => 0),
    total: 0,
  }));
};

export const categoryToKey = (value: string) =>
  value.toLowerCase().replace(/\s+/g, "_");

export const keyToLabel = (value: string) =>
  capitalize(value.replace(/_/g, " "));
