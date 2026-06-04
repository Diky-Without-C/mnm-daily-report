import { replaceItem } from "@/features/report/utils/replaceItem";
import { ITEMS_TO_REPLACE } from "@/features/MPO/sales.constant";
import { clearWhiteSpace } from "@/utils/clearWhiteSpace";
import { parseExcelFile } from "../xlsx.parser";
import type { ParsedSales } from "../xlsx.type";
import { schemas } from "./sales.schema";

export default function salesParser(bytes: Uint8Array, sheetIndex: number) {
  const { headerRows, contentRows } = parseExcelFile(bytes, sheetIndex, [
    "nama barang",
    "merk",
  ]);

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
      const item = `${row[indexes.item]} (${row[indexes.packing] || row[indexes.item].match(/[([](.+?)[)\]]/)?.[1]})`;
      const clearItem = replaceItem(clearWhiteSpace(item), ITEMS_TO_REPLACE);
      const category = row[indexes.category];

      const matchPacking = clearItem.match(/[([](.+?)[)\]]/);
      const packing = matchPacking?.[1];

      const matchCode = clearItem.match(
        /\b(?:MC|MD|SR|FC|RM|MF|TS)\s\d{3,4}\S*/g,
      );
      const code = matchCode?.[0] || "";
      const clearCode = code.replace(/\s/g, "");

      const clearName = clearItem.replace(code, "").replace(`(${packing})`, "");

      const transformed = schema.transform(row, indexes);
      const propperName = `${clearName} - ${clearCode} ${packing ? `(${packing})` : ""}`;

      return {
        item: propperName,
        packing,
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
