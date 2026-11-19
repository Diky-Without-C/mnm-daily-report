import { ITEM_TYPES, type ItemTypeCode } from "@constants/Items";
import { ITEMS_TO_CLEAR } from "@constants/rules/report.rules";
import { clearItem } from "@features/report/utils/clearItem";
import type { ParsedReport } from "../xlsx.type";
import { parseExcelFile } from "../xlsx.parser";

const REQUIRED_COLUMNS = ["item", "stock akhir"] as const;

const PATTERNS = {
  size: /\d+(?:[.,]\d+)?\s*[x×]\s*\d+(?:[.,]\d+)?(?:\s*cm)?/i,
  weight: /\d+(?:[.,]\d+)?\s*(?:gr|g|c)\b/i,
  code: /\b(?:\D{2})\d{3,4}\S*/i,
};

function findAndRemove(parts: string[], pattern: RegExp): string {
  const index = parts.findIndex((part) => pattern.test(part));

  if (index === -1) return "";

  return parts.splice(index, 1)[0].trim();
}

function normalizeText(value: unknown): string {
  return String(value ?? "").trim();
}

function getColumnIndex(headers: unknown[], column: string): number {
  return headers.findIndex(
    (cell) => normalizeText(cell).toLowerCase() === column,
  );
}

function parseItem(
  item: string,
  category: string,
  stock: string,
): ParsedReport {
  const updatedItem = clearItem(item, ITEMS_TO_CLEAR);

  const [rawType = "", ...parts] = updatedItem.split(/\s+-\s+/);

  // Extract attributes regardless of their position.
  const size = findAndRemove(parts, PATTERNS.size);
  const weight = findAndRemove(parts, PATTERNS.weight);

  const rawText = parts.join(" ").trim();

  const code = rawText.match(PATTERNS.code)?.[0] ?? "";

  const name = rawText
    .replace(PATTERNS.code, "")
    .replace(/-/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const type = Object.hasOwn(ITEM_TYPES, rawType)
    ? (rawType as ItemTypeCode)
    : "";

  return {
    name,
    type,
    code,
    category,
    size,
    weight,
    stock,
  };
}

export function parseReportRows(
  headerRows: unknown[],
  contentRows: unknown[][],
): ParsedReport[] {
  const [itemIdx, stockIdx] = REQUIRED_COLUMNS.map((column) =>
    getColumnIndex(headerRows, column),
  );

  if (itemIdx === -1 || stockIdx === -1) {
    throw new Error("Required columns not found");
  }

  let currentCategory = "";
  const items: ParsedReport[] = [];

  for (const row of contentRows) {
    const item = normalizeText(row[itemIdx]);

    if (!item) continue;

    const stock = normalizeText(row[stockIdx]);

    // Rows without the separator are category headings.
    if (!item.includes(" - ")) {
      currentCategory = item;
      continue;
    }

    items.push(parseItem(item, currentCategory, stock));
  }

  return items;
}

export default async function reportParser(
  bytes: Uint8Array,
  sheetIndex: number,
) {
  const { headerRows, contentRows } = await parseExcelFile(bytes, sheetIndex, [
    "item",
  ]);

  return parseReportRows(headerRows, contentRows);
}
