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

    return headerRows.findIndex((cell) =>
      keys.includes(String(cell).trim().toLowerCase()),
    );
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
      const item = String(row[indexes.item] || "");
      const packing = row[indexes.packing] || item.match(/[([](.+?)[)\]]/)?.[1];
      const category = row[indexes.category];

      const match = item.match(/\b(?:MC|MD|SR|FC|RM|MF|TS)\s\d{3,4}\S*/g);
      const code = match?.[0] || "";
      const clearCode = code.replace(/\s/g, "");

      const clearName = item
        .match(/[a-z]{3,}/gi)
        ?.join(" ")
        .trim();

      const transformed = schema.transform(row, indexes);

      return {
        item: `${clearName} ${clearCode} ${packing ? `(${packing})` : ""}`,
        packing,
        code: clearCode,
        category,
        total: transformed.total,
        monthlySale: transformed.monthlySale,
      };
    });

  return salesData.filter((data) => data.category) as ParsedSales[];
}
