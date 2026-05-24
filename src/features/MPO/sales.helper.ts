import type { ParsedSales } from "@/lib/xlsx/xlsx.type";
import { capitalize } from "@/utils/capitalize";
import { ITEMS_PER_PAGE, LAST_3_MONTHS } from "./sales.constant";

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
  page: number,
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

  const currentItems = paginate(processedSales, page, ITEMS_PER_PAGE);

  const emptyRows: PlaceholderSale[] = Array.from({
    length: Math.max(0, ITEMS_PER_PAGE - currentItems.length),
  }).map((_, index) => ({
    item: `placeholder-${index}`,
    last3MonthSales: LAST_3_MONTHS.map(() => 0),
    total3MonthSales: 0,
  }));

  return [...currentItems, ...emptyRows];
};

export const paginate = <T>(items: T[], page: number, perPage: number) => {
  const start = (page - 1) * perPage;

  return items.slice(start, start + perPage);
};

export const categoryToKey = (value: string) =>
  value.toLowerCase().replace(/\s+/g, "_");

export const keyToLabel = (value: string) =>
  capitalize(value.replace(/_/g, " "));
