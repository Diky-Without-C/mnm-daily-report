import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import { ITEM_TYPES, ITEM_CATEGORIES } from "@constants/Items";
import { getLast3Months } from "@features/sales/sales.utils";
import { CUSTOM_TITLES, EXTRA_INFO } from "@constants/rules/report.rules";
import { REPORT_HEADER } from "@constants/Report";
import { getOrderLabel } from "@features/orders/order.helpers";
import type {
  GroupedCategories,
  ParsedReport,
  ParsedSales,
} from "@libs/xlsx/xlsx.type";
import { capitalize } from "@utils/capitalize";
import { formatDate } from "@utils/formatDate";
import { formatNumber } from "@utils/formatNumber";
import { processedData } from "./report.builder";
import type { ProcessedGroup } from "./report.type";

const EXTRA_INFO_REGEX = new RegExp(`\\b(${EXTRA_INFO.join("|")})\\b`, "i");

const getTitle = ({ name, code }: ParsedReport) => {
  const formattedCode = code.replace(/ -/g, "");
  const title = `${name} (${formattedCode})`;

  return CUSTOM_TITLES[title as keyof typeof CUSTOM_TITLES] ?? title;
};

const groupItemByType = (items: ParsedReport[]) => {
  const map = new Map<string, ParsedReport[]>();

  for (const item of items) {
    if (!map.has(item.type)) {
      map.set(item.type, []);
    }

    map.get(item.type)!.push(item);
  }

  return [...map.values()];
};

const buildStockLine = (items: ParsedReport[]) => {
  return groupItemByType(items).map((group) => {
    const isMultiple = group.length > 1;

    return group
      .map((item, index) => {
        const extraInfo = item.name.match(EXTRA_INFO_REGEX)?.[0];
        const prefix = index === 0 ? item.type : " ".repeat(item.type.length);
        const suffix = isMultiple ? ` (${extraInfo ?? index + 1})` : "";
        const stock = formatNumber(Math.max(0, Number(item.stock)));

        return `${prefix}${suffix}: ${stock}`;
      })
      .join("\n");
  });
};

const buildContainerLine = (orders: OrderSchema[]) => {
  const lines = orders.map(getOrderLabel);

  return ["CONTAINER", ...lines];
};

const buildTotalLine = (content: ParsedReport[], orders: OrderSchema[]) => {
  const totalOrder = orders.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.type] = (acc[curr.type] ?? 0) + curr.amount;
    return acc;
  }, {});

  const totalContent = content.reduce<Record<string, number>>((acc, curr) => {
    const type = ITEM_TYPES[curr.type as keyof typeof ITEM_TYPES] ?? curr.type;

    acc[type] = (acc[type] ?? 0) + Math.max(0, Number(curr.stock));
    return acc;
  }, {});

  const group = [
    ...new Set([...Object.keys(totalContent), ...Object.keys(totalOrder)]),
  ];

  return group.map((type, index) => {
    const total = (totalContent[type] ?? 0) + (totalOrder[type] ?? 0);

    return `${index === 0 ? "TOTAL: " : " ".repeat(7)}${type} ⇒ ${formatNumber(total)} pcs`;
  });
};

const getPacking = (sale: ParsedSales) =>
  Number(sale.packing?.match(/\d+/)?.[0] ?? 0);

const buildSalesLine = (sales: ParsedSales[]) => {
  if (sales.length === 0) return [];

  const months = getLast3Months();
  const fallbackPacking = sales.map(getPacking).find(Boolean) ?? 0;

  let totalCartons = 0;
  let totalPieces = 0;
  const packings = new Set<number>();

  for (const sale of sales) {
    const cartons = months.reduce(
      (sum, month) => sum + (sale.monthlySale[month.index] || 0),
      0,
    );
    // Each row is converted with ITS OWN packing size (falls back to the first
    // known one for rows without it).
    const packing = getPacking(sale) || fallbackPacking;

    totalCartons += cartons;
    totalPieces += cartons * packing;
    packings.add(packing);
  }

  const multiplier =
    packings.size > 1 ? "(mixed)" : String([...packings][0] || "(?)");

  return [
    `MPO: ${formatNumber(totalCartons)} ctn x ${multiplier} ⇒ ${formatNumber(totalPieces)} pcs`,
  ];
};

const buildReportText = (group: ProcessedGroup) => {
  const title = getTitle(group.content[0]);
  const sales = group.sales ? buildSalesLine(group.sales) : [];
  const content = buildStockLine(group.content);
  const containers =
    group.orders.length > 0 ? buildContainerLine(group.orders) : [];
  const total =
    sales.length > 0 ? buildTotalLine(group.content, group.orders) : [];

  return [title, ...sales, ...content, ...containers, ...total].join("\n");
};

export const reportToText = (
  data: GroupedCategories,
  date: Date,
  orders: OrderSchema[],
  sales?: ParsedSales[],
) => {
  const normalized = processedData(data, orders, sales);

  const body = ITEM_CATEGORIES.map((key) => {
    const groups = normalized[key].map(buildReportText).join("\n\n");

    return `*${capitalize(key.replace(/_/g, " "))}\n\n${groups}\n`;
  });

  return [REPORT_HEADER, formatDate(date), "-".repeat(REPORT_HEADER.length), ...body].join(
    "\n",
  );
};
