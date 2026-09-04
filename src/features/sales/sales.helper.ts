import type { ParsedSales } from "@libs/xlsx/xlsx.type";
import { capitalize } from "@utils/capitalize";
import { LAST_3_MONTHS } from "./sales.constant";
import type { ProcessedSale, SalesFilter, SalesSort } from "./sales.type";

export const processingSales = (sales: ParsedSales[]) => {
  const processedSales: ProcessedSale[] = sales.map((item) => {
    const last3MonthSales = LAST_3_MONTHS().map(
      (month) => item.monthlySale[month.index] || 0,
    );
    return {
      ...item,
      last3MonthSales,
    };
  });

  return processedSales;
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

export const searchSales = (sales: ParsedSales[], search: string) => {
  const queries = search.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (!queries.length) return sales;

  return sales.filter((sale) => {
    const text = [sale.category, sale.item, sale.code, sale.packing, sale.total]
      .join(" ")
      .toLowerCase();

    return queries.every((query) => text.includes(query));
  });
};

export const filterSales = (sales: ParsedSales[], filters: SalesFilter) => {
  return sales.filter((sale) => filters.category[sale.category] ?? false);
};

export const sortSales = (
  sales: ParsedSales[],
  sort: SalesSort,
): ParsedSales[] => {
  return [...sales].sort((a, b) => {
    switch (sort) {
      case "monthly-asc":
        return a.total - b.total;
      case "monthly-desc":
        return b.total - a.total;
      default:
        return 0;
    }
  });
};
