import { parseExcelFile } from "../xlsx.parser";
import type { ParsedSales } from "../xlsx.type";

export default function salesParser(bytes: Uint8Array, sheetIndex: number) {
  const { headerRow, contentRows } = parseExcelFile(bytes, sheetIndex, {
    row: 3,
    col: 5,
  });

  const getIndex = (key: string) =>
    headerRow.findIndex(
      (cell) => String(cell).trim().toLowerCase() === key.toLowerCase(),
    );

  const itemIdx = getIndex("nama barang");
  const totalIdx = getIndex("ttl");
  const packingIdx = getIndex("kemasan");
  const categoryIdx = getIndex("merk");
  const monthStartIdx = getIndex("bulan");

  if (
    itemIdx === -1 ||
    totalIdx === -1 ||
    packingIdx === -1 ||
    categoryIdx === -1
  ) {
    throw new Error("Required columns not found");
  }

  const salesData = contentRows
    .filter((row) => row.some((cell) => cell))
    .map((row) => {
      const item = row[itemIdx];
      const total = Number(row[totalIdx]);
      const packing = row[packingIdx] || item.match(/\(([^)]+)\)/)?.[1];
      const category = row[categoryIdx];

      const match = item.match(/\b(?:MC|MD|SR|FC|RM|MF|TS)\s\d{3,4}\S*/g);
      const code = match?.[0]?.replace(/\s/g, "") ?? "";

      const monthlySale = Array.from(
        { length: 12 },
        (_, i) => Number(row[monthStartIdx + i]) || 0,
      );

      return { item, total, packing, code, category, monthlySale };
    });

  return salesData.filter((data) => data.category) as ParsedSales[];
}
