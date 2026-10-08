import type { ParsedSales } from "@libs/xlsx/xlsx.type";
import { capitalize } from "@utils/capitalize";
import { LAST_3_MONTHS } from "./sales.constant";
import type { ProcessedSale } from "./sales.type";
import type { MultipleField, SingleField } from "@constants/Order";

export const processingSales = (sales: ParsedSales[]): ProcessedSale[] => {
  return sales.map((item) => {
    const last3MonthSales = LAST_3_MONTHS().map(
      (month) => item.monthlySale[month.index] || 0,
    );

    return {
      ...item,
      last3MonthSales,
    };
  });
};

export const createEmptySales = (count: number): ProcessedSale[] => {
  return Array.from({ length: count }, (_, index) => ({
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

export const searchSales = (
  sales: ParsedSales[],
  search: string,
): ParsedSales[] => {
  const queries = search.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (!queries.length) return sales;

  return sales.filter((sale) => {
    const text = [sale.category, sale.item, sale.code, sale.packing, sale.total]
      .join(" ")
      .toLowerCase();

    return queries.every((query) => text.includes(query));
  });
};

export const filterSales = (
  sales: ParsedSales[],
  filters: Record<string, MultipleField>,
): ParsedSales[] => {
  const packing = filters.packing?.selectedValue;

  if (!packing?.length) {
    return sales;
  }

  return sales.filter((sale) => sale.packing && packing.includes(sale.packing));
};

export const sortSales = (
  sales: ParsedSales[],
  sort: Record<string, SingleField>,
): ParsedSales[] => {
  const field = sort.field?.selectedValue;
  const direction = sort.direction?.selectedValue === "ascending" ? 1 : -1;

  return [...sales].sort((a, b) => {
    switch (field) {
      case "total":
        return (a.total - b.total) * direction;

      case "code":
        return a.code.localeCompare(b.code) * direction;

      default:
        return 0;
    }
  });
};
