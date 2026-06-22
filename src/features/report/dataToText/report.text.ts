import type {
  GroupedCategories,
  ParsedReport,
  ParsedSales,
} from "@/lib/xlsx/xlsx.type";
import type { Report } from "@/app/supabase/report.dto";
import { CUSTOM_TITLES, EXTRA_INFO } from "../report.constant";
import { ORDER_CATEGORY } from "@/features/orders/order.constants";
import { formatNumber } from "@/utils/formatNumber";
import { capitalize } from "@/utils/capitalize";
import { formatDate } from "@/utils/formatDate";
import { CATEGORY_KEYS, HEADER } from "../report.constant";
import { processedData } from "./report.builder";
import type { ProcessedGroup } from "./report.type";

const getTitle = ({ name, code }: ParsedReport) => {
  const formattedCode = code.replace(/ -/g, "");
  const title = `${name} (${formattedCode})`;

  return CUSTOM_TITLES[title as keyof typeof CUSTOM_TITLES] ?? title;
};

const groupItemByType = (items: ParsedReport[]) => {
  const map = new Map<string, ParsedReport[]>();

  for (const item of items) {
    map.set(item.type, [...(map.get(item.type) ?? []), item]);
  }

  return [...map.values()];
};

const getStockLines = (items: ParsedReport[]) => {
  const itemGroups = groupItemByType(items);

  const stockLines = itemGroups.map((group) => {
    const isMultiple = group.length > 1;
    const EXTRA_INFO_REGEX = new RegExp(`\\b(${EXTRA_INFO.join("|")})\\b`, "i");

    const line = group.map((item, index) => {
      const extraInfo = item.name.match(EXTRA_INFO_REGEX);
      const prefix = index === 0 ? item.type : " ".repeat(item.type.length);
      const suffix = isMultiple ? ` (${extraInfo?.[0] ?? index + 1})` : "";
      const stock = formatNumber(Math.max(0, Number(item.stock)));

      return `${prefix}${suffix}: ${stock}`;
    });

    return line.join("\n");
  });

  return stockLines;
};

const getContainerLine = (order: Report) => {
  const { category, type, amount, code, from, number } = order;

  const categoryLine =
    category === ORDER_CATEGORY.CONTAINER
      ? `(${from} ${number})`
      : `(PO.${number}/${from})`;
  const line = [categoryLine, code, type, formatNumber(amount)].join(" ");

  return line;
};

const getSalesLine = (sales: ParsedSales[]) => {
  const totalSales = sales
    .flatMap((sale) => sale.monthlySale.slice(0, 3))
    .reduce((acc, curr) => acc + curr, 0);

  const packing = sales[0]?.packing?.match(/\d+/) ?? "(?)";
  const salesLine = `MPO: ${formatNumber(totalSales)} ctn x ${packing} ⇒ ${formatNumber(totalSales * Number(packing[0]))} pcs`;

  return sales.length ? [salesLine] : [];
};

const buildReportText = (group: ProcessedGroup) => {
  const title = getTitle(group.content[0]);
  const sales = group.sales ? getSalesLine(group.sales) : [];
  const content = getStockLines(group.content);
  const containersLine =
    group.orders.length > 0
      ? ["CONTAINER", ...group.orders.map(getContainerLine)]
      : [];

  return [title, ...sales, ...content, ...containersLine].join("\n");
};

export const reportToText = (
  data: GroupedCategories,
  date: Date,
  order: Report[],
  sales?: ParsedSales[],
) => {
  const normalized = processedData(data, order, sales);

  const body = CATEGORY_KEYS.map((key) => {
    const content = normalized[key]
      .map((group) => buildReportText(group))
      .join("\n\n");

    return `*${capitalize(key.replace(/_/g, " "))}\n\n${content}\n`;
  });

  return [HEADER, formatDate(date), "-".repeat(HEADER.length), ...body].join(
    "\n",
  );
};
