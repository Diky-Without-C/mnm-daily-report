import * as XLSX from "xlsx";

export function parseExcelFile(
  bytes: Uint8Array,
  sheetIndex: number,
  { row, col }: { row: number; col: number },
) {
  const workbook = XLSX.read(bytes, { type: "array" });
  const sheetName = workbook.SheetNames[sheetIndex - 1];
  if (!sheetName) throw new Error("Sheet index not found");

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });

  const headerRow = rows[row] || [];
  const contentRows = rows.slice(col);

  return { headerRow, contentRows };
}
