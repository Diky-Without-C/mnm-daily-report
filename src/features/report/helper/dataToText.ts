import { EXTRA_INFO, CUSTOM_TITLES } from "@/app/constants";
import type { Report } from "@/app/supabase/report.dto";
import type {
  GroupedCategories,
  ParsedReport,
  ParsedSales,
} from "@/lib/xlsx/xlsx.type";
import { ORDER_CATEGORY } from "@/features/orders/order.constants";
import { CODE_GROUPS } from "@/features/MPO/sales.constant";
import { formatNumber } from "@/utils/formatNumber";
import { capitalize } from "@/utils/capitalize";
import { CATEGORY_KEYS, HEADER } from "../report.constant";
import { splitByType } from "./splitByType";
import { cleanName } from "./cleanName";
import { getExtraInfo } from "./getExtraInfo";

type NormalizedReport = Omit<ParsedReport, "stock"> & {
  stock: number;
  name: string;
  extra: string;
};

type OrdersGroup = {
  container: string[];
  preOrder: string[];
};

type StockLine = {
  type: string;
  stock: number;
  suffix?: string;
};

type StockGroup = {
  title: string;
  lines: StockLine[];
  footer: string[];
};

const normalizeItem = (item: ParsedReport): NormalizedReport => ({
  ...item,
  stock: Math.max(Number(item.stock) || 0, 0),
  name: cleanName(item.name),
  extra: getExtraInfo(item.name),
});

const normalizeCode = (code: string) =>
  String(code).trim().replace(/\s+/g, "").toUpperCase();

const normalizeData = (
  data: GroupedCategories,
): Record<string, NormalizedReport[][]> => {
  return Object.fromEntries(
    Object.entries(data).map(([key, groups]) => [
      key,
      groups.map((group) => group.map(normalizeItem)),
    ]),
  ) as unknown as Record<string, NormalizedReport[][]>;
};

const getSalesGroupKey = (code: string) =>
  CODE_GROUPS[normalizeCode(code) as keyof typeof CODE_GROUPS] ??
  normalizeCode(code);

const buildSalesMap = (sales: ParsedSales[]) => {
  const map: Record<string, number> = {};

  for (const sale of sales) {
    const key = getSalesGroupKey(sale.code);

    const packing = sale.packing
      ? Number(String(sale.packing).split(/x/gi)[0])
      : 1;

    map[key] = (map[key] ?? 0) + sale.total * packing;
  }

  return map;
};

const formatPreOrder = ({ number, from, type, amount }: Report) =>
  `(PO.${number}/${from}) ${type} ${formatNumber(amount)}`;

const formatContainer = ({ number, from, type, amount }: Report) =>
  `${from} ${number.toString().padStart(2, "0")} ${type} ${formatNumber(amount)}`;

const groupReportsByCode = (reports: Report[]): Record<string, OrdersGroup> => {
  const result: Record<string, OrdersGroup> = {};

  for (const report of reports) {
    const { category } = report;
    const code = normalizeCode(report.code);

    if (!result[code]) {
      result[code] = {
        container: [],
        preOrder: [],
      };
    }

    switch (category) {
      case ORDER_CATEGORY.CONTAINER:
        result[code].container.push(formatContainer(report));
        break;
      case ORDER_CATEGORY.PRE_ORDER:
        result[code].preOrder.push(formatPreOrder(report));
        break;
    }
  }

  return result;
};

const getTitle = ({
  name,
  code,
  sale,
}: NormalizedReport & { sale: number }) => {
  const formattedCode = code.replace(/ -/g, "");
  const title = `${name} (${formattedCode})`;
  const saleText = sale > 0 ? `- ${formatNumber(sale)} pcs` : "";

  if (title in CUSTOM_TITLES) {
    return `${CUSTOM_TITLES[title as keyof typeof CUSTOM_TITLES]} ${saleText}`;
  }

  return `${name} (${formattedCode}) ${saleText}`;
};

const buildStockLines = (items: NormalizedReport[]): StockLine[] => {
  const multiple = items.length > 1;

  return items.map((item, index) => {
    const needsSuffix = multiple || EXTRA_INFO.includes(item.extra);

    return {
      type: index === 0 ? item.type : "",
      stock: item.stock,
      suffix: needsSuffix
        ? item.extra
          ? capitalize(item.extra)
          : `(${index + 1})`
        : undefined,
    };
  });
};

const resolveGroupLines = (items: NormalizedReport[]): StockLine[] => {
  return splitByType(items).flatMap(buildStockLines);
};

const resolveGroupOrders = (
  itemCodes: Set<string>,
  orders: Record<string, OrdersGroup>,
): string[] => {
  const containers: string[] = [];

  for (const code of itemCodes) {
    const order = orders[code];
    if (!order) continue;

    containers.push(...order.preOrder);
    containers.push(...order.container);
  }

  return containers.sort();
};

const resolveGroupSales = (
  itemCodes: Set<string>,
  salesMap: Record<string, number>,
) => {
  const groupKeys = new Set([...itemCodes].map(getSalesGroupKey));

  let total = 0;

  for (const key of groupKeys) {
    total += salesMap[key] ?? 0;
  }

  return total;
};

const buildGroup = (
  items: NormalizedReport[],
  salesMap: Record<string, number>,
  orders: Record<string, OrdersGroup>,
): StockGroup | null => {
  if (!items.length) return null;

  const itemCodes = new Set(items.map((item) => normalizeCode(item.code)));
  const totalSales = resolveGroupSales(itemCodes, salesMap);

  return {
    title: getTitle({ ...items[0], sale: totalSales }),
    lines: resolveGroupLines(items),
    footer: resolveGroupOrders(itemCodes, orders),
  };
};

const formatStockLine = ({ type, stock, suffix }: StockLine, pad: number) =>
  `${type.padEnd(pad)}${suffix ? ` ${suffix}` : ""}: ${formatNumber(stock)}`;

const formatGroup = ({ title, lines, footer }: StockGroup) => {
  const pad = Math.max(...lines.map((line) => line.type.length));
  const body = lines.map((line) => formatStockLine(line, pad)).join("\n");

  return [title, body, footer.length ? `CONTAINER\n${footer.join("\n")}` : ""]
    .filter(Boolean)
    .join("\n");
};

export const dataToText = (
  data: GroupedCategories,
  date: string,
  reports: Report[],
  sales: ParsedSales[] = [],
): string => {
  const normalizedData = normalizeData(data);
  const salesMap = buildSalesMap(sales);
  const reportsByCode = groupReportsByCode(reports);

  const body = CATEGORY_KEYS.map((key) => {
    const content = normalizedData[key]
      .map((group) => buildGroup(group, salesMap, reportsByCode))
      .filter(Boolean)
      .map((item) => item && formatGroup(item))
      .join("\n\n");

    return content ? `*${key.replace(/_/g, " ")}\n\n${content}` : "";
  })
    .filter(Boolean)
    .join("\n\n");

  return [HEADER, date, "-----------------------------------", body].join("\n");
};
