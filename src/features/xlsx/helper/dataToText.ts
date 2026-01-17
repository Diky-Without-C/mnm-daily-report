import { ITEM_TYPES, EXTRA_INFO, CUSTOM_TITLES } from "@/app/constants";
import type { Report } from "@/app/supabase/report.dto";
import { formatNumber } from "@/utils/formatNumber";
import { capitalize } from "@/utils/capitalize";
import { CATEGORY_KEYS } from "../xlsx.constant";
import type { GroupedCategories, ParsedItem } from "../xlsx.type";
import { splitByType } from "./splitByType";

const ITEM_TYPE_REGEX = new RegExp(Object.values(ITEM_TYPES).join("|"), "gi");

const EXTRA_INFO_REGEX = new RegExp(EXTRA_INFO.join("|"), "gi");

const cleanName = (name: string): string =>
  name.replace(ITEM_TYPE_REGEX, "").trim();

const resolveTitle = (item: ParsedItem): string => {
  const custom = CUSTOM_TITLES.find((t) => item.name.includes(t.name));

  return custom
    ? custom.to
    : `${cleanName(item.name)} (${item.code.replace(/ -/g, "")})`;
};

const formatStockLines = (group: ParsedItem[]): string[] =>
  splitByType(group).map((items) => {
    const isMultiple = items.length > 1;

    return items
      .map((item, index) => {
        const stock = Math.max(Number(item.stock), 0);
        const extra = item.name.match(EXTRA_INFO_REGEX)?.[0] || "";

        const suffix =
          isMultiple || EXTRA_INFO.includes(extra)
            ? ` ${extra ? capitalize(extra) : `(${index + 1})`}`
            : "";

        return `${index === 0 ? item.type : " ".repeat(item.type.length)}${suffix}: ${formatNumber(stock)}`;
      })
      .join("\n");
  });

const formatReportFooter = (reports: Report[]): string => {
  if (!reports.length) return "";

  const preOrder = reports
    .filter((r) => r.category === "pre order")
    .map(
      ({ number, from, type, amount }) =>
        `(PO.${number}/${from}) ${type} ${formatNumber(amount)}`,
    )
    .sort();

  const container = reports
    .filter((r) => r.category === "container")
    .map(
      ({ number, from, type, amount }) =>
        `${from} ${number > 9 ? number : `0${number}`} ${type} ${formatNumber(amount)}`,
    )
    .sort();

  return `\nCONTAINER\n${[...container, ...preOrder].join("\n")}`;
};

const formatGroup = (
  group: ParsedItem[],
  reportByCode: Record<string, Report[]>,
): string => {
  const [first] = group;

  const title = resolveTitle(first);
  const stockLines = formatStockLines(group);
  const footer = formatReportFooter(reportByCode[first.code] ?? []);

  return `${title}\n${stockLines.join("\n")}${footer}`;
};

const formatCategory = (
  groups: ParsedItem[][],
  label: string,
  reportByCode: Record<string, Report[]>,
): string => {
  if (!groups.length) return "";

  const content = groups
    .map((group) => formatGroup(group, reportByCode))
    .join("\n\n");

  return `*${label}\n\n${content}\n\n`;
};

export const dataToText = (
  data: GroupedCategories,
  date: string,
  hulaan: string,
  report: Report[],
): string => {
  const reportByCode = report.reduce<Record<string, Report[]>>((acc, r) => {
    (acc[r.code] ||= []).push(r);
    return acc;
  }, {});

  const header = `LAPORAN HARIAN STOCK LAYER PVC\n${date}\n-----------------------------------`;

  const footer = `STOCK DI HULAAN\n-----------------------------------`;

  const body = CATEGORY_KEYS.map((key) =>
    formatCategory(data[key], key.replace(/_/g, " "), reportByCode),
  )
    .join("")
    .trim();

  return `${header}\n\n${body}\n\n${footer}\n\n${hulaan}`;
};
