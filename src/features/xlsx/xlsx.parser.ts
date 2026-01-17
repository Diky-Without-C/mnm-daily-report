import * as XLSX from "xlsx";
import { ITEM_TYPES, type ItemTypeCode } from "@/app/constants";
import { clearItem } from "./utils/clearItem";
import { replaceItem } from "./utils/replaceItem";
import type { ParsedItem } from "./xlsx.type";
import { ITEMS_TO_REPLACE, ITEMS_TO_CLEAR } from "./xlsx.constant";

export function parseExcelFile(
  binary: string,
  sheetIndex: number,
): ParsedItem[] {
  const workbook = XLSX.read(binary, { type: "binary" });
  const sheetName = workbook.SheetNames[sheetIndex - 1];
  if (!sheetName) throw new Error("Sheet index not found");

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });

  const headerRow = rows[4] || [];
  const contentRows = rows.slice(6);

  const getIndex = (key: string) =>
    headerRow.findIndex(
      (cell) => String(cell).trim().toLowerCase() === key.toLowerCase(),
    );

  const itemIdx = getIndex("item");
  const stockIdx = getIndex("stock akhir");

  if (itemIdx === -1 || stockIdx === -1) {
    throw new Error("Required columns not found");
  }

  let currentCategory = "";

  return contentRows
    .filter((row) => row.some((cell) => cell))
    .map((row) => {
      const item = row[itemIdx];
      const stock = String(row[stockIdx] ?? "");

      if (!item?.includes(" - ")) {
        currentCategory = item;
        return;
      }

      const updatedItem = clearItem(
        replaceItem(item, ITEMS_TO_REPLACE),
        ITEMS_TO_CLEAR,
      );
      const parts = updatedItem.split(" - ");
      const [rawType, ...rest] = parts;

      let size = "";
      let weight = "";
      const restCopy = [...rest];

      if (/\d+(gr|g|c)/i.test(restCopy.at(-1)!)) {
        weight = restCopy.pop()!;
      }

      if (/\d+x\d+/i.test(restCopy.at(-1)!)) {
        size = restCopy.pop()!;
      }

      const code = restCopy.pop() || "";
      const name = restCopy.join(" ").trim();
      const type = rawType in ITEM_TYPES ? (rawType as ItemTypeCode) : "";

      return {
        name,
        type,
        code,
        category: currentCategory.trim(),
        size,
        weight,
        stock,
      };
    })
    .filter(Boolean) as ParsedItem[];
}
