import type { Report } from "@apps/supabase/report.dto";
import { CODE_GROUPS } from "@features/sales/sales.constant";
import type {
  GroupedCategories,
  ParsedReport,
  ParsedSales,
} from "@libs/xlsx/xlsx.type";
import type { ProcessedGroups } from "./report.type";

const normalizeCode = (code: string) => {
  return String(code).trim().replace(/\s+/g, "").toUpperCase();
};

export const groupOrdersByCode = (orders: Report[]) => {
  const result: Record<string, Report[]> = {};

  for (const order of orders) {
    const code = normalizeCode(order.code);

    if (!result[code]) {
      result[code] = [];
    }

    result[code].push(order);
  }

  return result;
};

const getSalesCode = (code: string) => {
  const normalized = normalizeCode(code);

  return CODE_GROUPS[normalized as keyof typeof CODE_GROUPS] ?? normalized;
};

export const groupSalesByCode = (sales: ParsedSales[]) => {
  const result: Record<string, ParsedSales[]> = {};

  for (const sale of sales) {
    const code = getSalesCode(sale.code);

    (result[code] ??= []).push(sale);
  }

  return result;
};

const sortByCategory = (item: Report[]) => {
  return item.sort(
    (a, b) =>
      a.category.localeCompare(b.category) ||
      a.number - b.number ||
      a.type.localeCompare(b.type),
  );
};

const buildOrdersGroup = (
  pair: ParsedReport[],
  orders: Record<string, Report[]>,
  sales?: Record<string, ParsedSales[]>,
) => {
  const itemCodes = new Set(pair.map((item) => normalizeCode(item.code)));

  const containers: Report[] = [];
  const connectedSales: ParsedSales[] = [];

  for (const code of itemCodes) {
    containers.push(...(orders[code] ?? []));
    connectedSales.push(...(sales?.[code] ?? []));
  }

  return {
    content: pair,
    orders: sortByCategory(containers),
    sales: connectedSales,
  };
};

export const processedData = (
  groups: GroupedCategories,
  orders: Report[],
  sales?: ParsedSales[],
): ProcessedGroups => {
  const groupedOrders = groupOrdersByCode(orders);
  const groupedSales = sales ? groupSalesByCode(sales) : undefined;

  return Object.fromEntries(
    Object.entries(groups).map(([key, groups]) => [
      key,
      groups.map((pair) => buildOrdersGroup(pair, groupedOrders, groupedSales)),
    ]),
  ) as ProcessedGroups;
};
