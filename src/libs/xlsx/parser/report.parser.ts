import { ITEM_TYPES, type ItemTypeCode } from "@constants/Items";
import { ITEMS_TO_REPLACE, ITEMS_TO_CLEAR } from "@constants/rules/report.rules";
import { clearItem } from "@features/report/utils/clearItem";
import { replaceItem } from "@features/report/utils/replaceItem";
import type { ParsedReport } from "../xlsx.type";
import { parseExcelFile } from "../xlsx.parser";

type Row = unknown[];

/** Pure: turns the header + content rows of a sheet into report items. */
export function parseReportRows(
  headerRows: Row,
  contentRows: Row[],
): ParsedReport[] {
  const getIndex = (key: string) =>
    headerRows.findIndex(
      (cell) => String(cell).trim().toLowerCase() === key.toLowerCase(),
    );

  const itemIdx = getIndex("item");
  const stockIdx = getIndex("stock akhir");

  if (itemIdx === -1 || stockIdx === -1) {
    throw new Error("Required columns not found");
  }

  let currentCategory = "";
  const items: ParsedReport[] = [];

  for (const row of contentRows) {
    if (!row.some((cell) => cell)) continue;

    // Excel may hand back numbers for numeric-looking cells.
    const item = String(row[itemIdx] ?? "");
    const stock = String(row[stockIdx] ?? "");

    // Rows without " - " are category headings.
    if (!item.includes(" - ")) {
      currentCategory = item;
      continue;
    }

    const updatedItem = clearItem(
      replaceItem(item, ITEMS_TO_REPLACE),
      ITEMS_TO_CLEAR,
    );
    const [rawType, ...rest] = updatedItem.split(" - ");

    let size = "";
    let weight = "";
    const restCopy = [...rest];

    if (/\d+(gr|g|c)/i.test(restCopy.at(-1) ?? "")) {
      weight = restCopy.pop()!;
    }

    if (/\d+x\d+/i.test(restCopy.at(-1) ?? "")) {
      size = restCopy.pop()!;
    }

    const rawText = restCopy.join(" ").trim();

    const code =
      rawText.match(/\b(?:MC|MD|SR|FC|RM|MF|TS)\d{3,4}\S*/g)?.[0] ?? "";

    const name = rawText
      .replace(code, "")
      .replace(/-/g, "")
      .replace(/\s+/gi, " ")
      .trim();

    const type = Object.hasOwn(ITEM_TYPES, rawType)
      ? (rawType as ItemTypeCode)
      : "";

    items.push({
      name,
      type,
      code,
      category: currentCategory.trim(),
      size,
      weight,
      stock,
    });
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
