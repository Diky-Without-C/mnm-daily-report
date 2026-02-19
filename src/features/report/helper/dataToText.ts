import { EXTRA_INFO, CUSTOM_TITLES } from "@/app/constants";
import type { Report } from "@/app/supabase/report.dto";
import type { GroupedCategories, ParsedItem } from "@/lib/xlsx/xlsx.type";
import { ORDER_CATEGORY } from "@/features/orders/order.constants";
import { formatNumber } from "@/utils/formatNumber";
import { capitalize } from "@/utils/capitalize";
import { CATEGORY_KEYS, HEADER } from "../report.constant";
import { splitByType } from "./splitByType";
import { cleanName } from "./cleanName";
import { getExtraInfo } from "./getExtraInfo";

const normalize = (item: ParsedItem) => ({
  ...item,
  stock: Math.max(Number(item.stock) || 0, 0),
  name: cleanName(item.name),
  extra: getExtraInfo(item.name),
});

const getTitle = ({ name, code }: ParsedItem): string => {
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

const buildStockLines = (items: ParsedItem[]): StockLine[] => {
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

const groupReportsByCode = (reports: Report[]) =>
  reports.reduce<Record<string, ReportGroup>>((acc, r) => {
    acc[r.code] ??= { container: [], preOrder: [] };

    if (r.category === ORDER_CATEGORY.CONTAINER) {
      acc[r.code].container.push(formatContainer(r));
    } else if (r.category === ORDER_CATEGORY.PRE_ORDER) {
      acc[r.code].preOrder.push(formatPreOrder(r));
    }

    return acc;
  }, {});

type StockGroup = {
  title: string;
  lines: StockLine[];
  footer: string[];
};

const buildGroup = (
  items: ParsedItem[],
  reports?: ReportGroup,
): StockGroup | null => {
  if (!items.length) return null;

  const lines = splitByType(items).flatMap(buildStockLines);
  const footer = [
    ...(reports?.container ?? []),
    ...(reports?.preOrder ?? []),
  ].sort();

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
    const content = data[key]
      .map((group) => buildGroup(group, reportsByCode[group[0]?.code]))
      .filter(isStockGroup)
      .map(formatGroup)
      .join("\n\n");

    return content ? `*${key.replace(/_/g, " ")}\n\n${content}` : "";
  })
    .filter(Boolean)
    .join("\n\n");

  return [HEADER, date, "-----------------------------------", body].join("\n");
};
