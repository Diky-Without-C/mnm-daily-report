import { EXTRA_INFO, CUSTOM_TITLES } from "@/app/constants";
import type { Report } from "@/app/supabase/report.dto";
import type { GroupedCategories, ParsedReport } from "@/lib/xlsx/xlsx.type";
import { ORDER_CATEGORY } from "@/features/orders/order.constants";
import { formatNumber } from "@/utils/formatNumber";
import { capitalize } from "@/utils/capitalize";
import { CATEGORY_KEYS, HEADER } from "../report.constant";
import { splitByType } from "./splitByType";
import { cleanName } from "./cleanName";
import { getExtraInfo } from "./getExtraInfo";

const normalize = (item: ParsedReport) => ({
  ...item,
  stock: Math.max(Number(item.stock) || 0, 0),
  name: cleanName(item.name),
  extra: getExtraInfo(item.name),
});

const getTitle = ({ name, code }: ParsedReport): string => {
  const title = `${name} (${code.replace(/ -/g, "")})`;

  if (Object.keys(CUSTOM_TITLES).includes(title)) {
    return CUSTOM_TITLES[title as keyof typeof CUSTOM_TITLES];
  }

  return `${cleanName(name)} (${code.replace(/ -/g, "")})`;
};

type StockLine = {
  type: string;
  stock: number;
  suffix?: string;
};

const buildStockLines = (items: ParsedReport[]): StockLine[] => {
  const multiple = items.length > 1;

  return items.map((item, index) => {
    const { stock, extra } = normalize(item);
    const needsSuffix = multiple || EXTRA_INFO.includes(extra);

    return {
      type: index === 0 ? item.type : "",
      stock,
      suffix: needsSuffix
        ? extra
          ? capitalize(extra)
          : `(${index + 1})`
        : undefined,
    };
  });
};

const formatStockLine = ({ type, stock, suffix }: StockLine, pad: number) =>
  `${type.padEnd(pad)}${suffix ? ` ${suffix}` : ""}: ${formatNumber(stock)}`;

type ReportGroup = {
  container: string[];
  preOrder: string[];
};

const formatPreOrder = ({ number, from, type, amount }: Report) =>
  `(PO.${number}/${from}) ${type} ${formatNumber(amount)}`;

const formatContainer = ({ number, from, type, amount }: Report) =>
  `${from} ${number.toString().padStart(2, "0")} ${type} ${formatNumber(amount)}`;

const groupReportsByCode = (reports: Report[]): Record<string, ReportGroup> => {
  const result: Record<string, ReportGroup> = {};

  for (const report of reports) {
    const { code, category } = report;

    if (!result[code]) {
      result[code] = { container: [], preOrder: [] };
    }

    const group = result[code];

    switch (category) {
      case ORDER_CATEGORY.CONTAINER:
        group.container.push(formatContainer(report));
        break;

      case ORDER_CATEGORY.PRE_ORDER:
        group.preOrder.push(formatPreOrder(report));
        break;
    }
  }

  return result;
};

type StockGroup = {
  title: string;
  lines: StockLine[];
  footer: string[];
};

const buildGroup = (
  items: ParsedReport[],
  reports?: Record<string, ReportGroup>,
): StockGroup | null => {
  if (!items.length) return null;
  const lines = splitByType(items).flatMap(buildStockLines);

  const preOrders: string[] = [];
  const containers: string[] = [];

  for (const code of Object.keys(reports || {})) {
    if (!reports) break;

    if (items.some((item) => item.code === code)) {
      preOrders.push(...reports[code].preOrder);
      containers.push(...reports[code].container);
    }
  }

  const footer = [...preOrders, ...containers].sort();

  return {
    title: getTitle(items[0]),
    lines,
    footer,
  };
};

const formatGroup = ({ title, lines, footer }: StockGroup) => {
  const pad = Math.max(...lines.map((l) => l.type.length));
  const body = lines.map((l) => formatStockLine(l, pad)).join("\n");

  return [title, body, footer.length && `CONTAINER\n${footer.join("\n")}`]
    .filter(Boolean)
    .join("\n");
};

export const dataToText = (
  data: GroupedCategories,
  date: string,
  reports: Report[],
): string => {
  const reportsByCode = groupReportsByCode(reports);
  const isStockGroup = (g: StockGroup | null): g is StockGroup => g !== null;

  const body = CATEGORY_KEYS.map((key) => {
    const rawContent = data[key].flatMap((group) =>
      buildGroup(group, reportsByCode),
    );

    const content = rawContent
      .filter(isStockGroup)
      .map(formatGroup)
      .join("\n\n");

    return content ? `*${key.replace(/_/g, " ")}\n\n${content}` : "";
  })
    .filter(Boolean)
    .join("\n\n");

  return [HEADER, date, "-----------------------------------", body].join("\n");
};
