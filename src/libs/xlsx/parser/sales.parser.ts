import { replaceItem } from "@features/report/utils/replaceItem";
import { SALES_ITEMS_TO_REPLACE } from "@constants/rules/sales.rules";
import { clearWhiteSpace } from "@utils/clearWhiteSpace";
import { parseExcelFile } from "../xlsx.parser";
import type { ParsedSales } from "../xlsx.type";
import { schemas } from "./sales.schema";

type Row = unknown[];

/** Pure: turns the header + content rows of a sales sheet into sales items. */
export function parseSalesRows(
  headerRows: Row,
  contentRows: Row[],
): ParsedSales[] {
  const getIndex = (key: string | string[]) => {
    const keys = Array.isArray(key) ? key : [key];

    return headerRows.findIndex((cell) => {
      const header = String(cell).trim().toLowerCase();

      return keys.some((key) => header.includes(key.toLowerCase()));
    });
  };

  const schema = schemas.find((schema) =>
    Object.values(schema.columns).every((column) => {
      if (!column) return true;
      return getIndex(column) !== -1;
    }),
  );

  if (!schema) {
    throw new Error("Unknown file schema");
  }

  const indexes = Object.entries(schema.columns).reduce(
    (acc, [key, value]) => {
      acc[key] = value ? getIndex(value) : -1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const salesData = contentRows
    .filter((row) => row.some((cell) => cell))
    .map((row) => {
      const rawItem = String(row[indexes.item] ?? "");
      const rawPacking =
        String(row[indexes.packing] ?? "").trim() ||
        rawItem.match(/[([](.+?)[)\]]/)?.[1];

      // Only append "(packing)" when there is one (it used to append the
      // literal text "(undefined)").
      const item = rawPacking ? `${rawItem} (${rawPacking})` : rawItem;
      const clearItem = replaceItem(clearWhiteSpace(item), SALES_ITEMS_TO_REPLACE);
      const category = String(row[indexes.category] ?? "");

      const matchPacking = clearItem.match(/[([](.+?)[)\]]/);
      const packing = matchPacking?.[1];
      const clearPacking = packing?.toLowerCase();

      const matchCode = clearItem.match(
        /\b(?:MC|MD|SR|FC|RM|MF|TS)\s\d{3,4}\S*/g,
      );
      const code = matchCode?.[0] || "";
      const clearCode = code.replace(/\s/g, "");

      const clearName = clearItem.replace(code, "").replace(`(${packing})`, "");

      const transformed = schema.transform(row, indexes);
      const propperName = `${clearName} - ${clearCode} ${clearPacking ? `(${clearPacking})` : ""}`;

      return {
        item: propperName,
        packing: clearPacking,
        code: clearCode,
        category,
        total: transformed.total,
        monthlySale: transformed.monthlySale,
      };
    });

  return salesData.filter(
    ({ code, total, category }) => category && code !== "" && total > 0,
  ) as ParsedSales[];
}

export default async function salesParser(
  bytes: Uint8Array,
  sheetIndex: number,
) {
  const { headerRows, contentRows } = await parseExcelFile(bytes, sheetIndex, [
    "nama barang",
    "merk",
  ]);

  return parseSalesRows(headerRows, contentRows);
}
