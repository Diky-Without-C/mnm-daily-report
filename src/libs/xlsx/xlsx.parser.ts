import * as XLSX from "xlsx";

export function parseExcelFile(
  bytes: Uint8Array,
  sheetIndex: number,
  requireHeader: string[] = [],
) {
  const workbook = XLSX.read(bytes, { type: "array" });
  const sheetName = workbook.SheetNames[sheetIndex - 1];

  if (!sheetName) {
    throw new Error("Sheet index not found");
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    defval: "",
  });

  const normalize = (value: unknown) => String(value).trim().toLowerCase();

  const headerRowIndex = rows.findIndex((row) => {
    const normalizedRow = row.map(normalize);

    return requireHeader.every((header) => normalizedRow.includes(header));
  });

  if (headerRowIndex === -1) {
    throw new Error("Header row not found");
  }

  const headerRows = rows[headerRowIndex];
  const contentRowIndex = rows.findIndex(
    (row, index) =>
      index > headerRowIndex && row.some((cell) => normalize(cell)),
  );

  const contentRows = contentRowIndex === -1 ? [] : rows.slice(contentRowIndex);

  return { headerRows, contentRows };
}
