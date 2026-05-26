import { ITEM_TYPES, type ItemTypeCode } from "@/app/constants";
import {
  ITEMS_TO_REPLACE,
  ITEMS_TO_CLEAR,
} from "@/features/report/report.constant";
import { clearItem } from "@/features/report/utils/clearItem";
import { replaceItem } from "@/features/report/utils/replaceItem";
import type { ParsedReport } from "../xlsx.type";
import { parseExcelFile } from "../xlsx.parser";

export default function reportParser(bytes: Uint8Array, sheetIndex: number) {
  const { headerRows, contentRows } = parseExcelFile(bytes, sheetIndex, [
    "item",
  ]);

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

      const rawText = restCopy.join(" ").trim();

      const match = rawText.match(/\b(?:MC|MD|SR|FC|RM|MF|TS)\d{3,4}\S*/g);
      const code = match?.[0] ?? "";

      const name = rawText
        .replace(code, "")
        .replace(/-/g, "")
        .replace(/\s+/gi, " ")
        .trim();

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
    .filter(Boolean) as ParsedReport[];
}
