import { ITEM_TYPES } from "@apps/constants";
import type { Report } from "@apps/supabase/report.dto";
import { ORDER_CATEGORY } from "@features/orders/order.constants";
import { LAST_3_MONTHS } from "@features/sales/sales.constant";
import type {
  GroupedCategories,
  ParsedReport,
  ParsedSales,
} from "@libs/xlsx/xlsx.type";
import { capitalize } from "@utils/capitalize";
import { formatDate } from "@utils/formatDate";
import { formatNumber } from "@utils/formatNumber";
import {
  CATEGORY_KEYS,
  CUSTOM_TITLES,
  EXTRA_INFO,
  HEADER,
} from "../report.constant";
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

const buildContainerLine = (orders: Report[]) => {
  const lines = orders.map((order) => {
    const { category, type, amount, code, from, number } = order;

    const categoryLine =
      category === ORDER_CATEGORY.CONTAINER
        ? `(${from} ${number})`
        : `(PO.${number}/${from})`;

    return [categoryLine, code, type, formatNumber(amount)].join(" ");
  });

  return ["CONTAINER", ...lines];
};

const buildTotalLine = (content: ParsedReport[], orders: Report[]) => {
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

const buildSalesLine = (sales: ParsedSales[]) => {
  const totalSales = sales
    .flatMap((sale) =>
      LAST_3_MONTHS().map((month) => sale.monthlySale[month.index] || 0),
    )
    .reduce((acc, curr) => acc + curr, 0);

  const packing = Number(sales[0]?.packing?.match(/\d+/)?.[0] ?? 0);

  const salesLine = [
    `MPO: ${formatNumber(totalSales)} ctn`,
    `x ${packing || "(?)"}`,
    `⇒ ${formatNumber(totalSales * packing)} pcs`,
  ].join(" ");

  return sales.length > 0 ? [salesLine] : [];
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
  orders: Report[],
  sales?: ParsedSales[],
) => {
  const normalized = processedData(data, orders, sales);

  const body = CATEGORY_KEYS.map((key) => {
    const groups = normalized[key].map(buildReportText).join("\n\n");

    return `*${capitalize(key.replace(/_/g, " "))}\n\n${groups}\n`;
  });

  return [HEADER, formatDate(date), "-".repeat(HEADER.length), ...body].join(
    "\n",
  );
};
