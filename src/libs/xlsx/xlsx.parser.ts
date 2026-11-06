// `xlsx` is large (~1 MB). Load it on first use so it stays out of the initial
// bundle and the first paint.
type XlsxModule = typeof import("xlsx");

let xlsxModule: Promise<XlsxModule> | undefined;
const loadXlsx = () => (xlsxModule ??= import("xlsx"));

/** Starts downloading the library in the background (no-op if already loaded). */
export const preloadXlsx = () => {
  loadXlsx().catch(() => {
    xlsxModule = undefined; // allow a retry when it is really needed
  });
};

const sheetNamesCache = new WeakMap<Uint8Array, string[]>();

async function getSheetNames(XLSX: XlsxModule, bytes: Uint8Array) {
  let names = sheetNamesCache.get(bytes);

  if (!names) {
    // `bookSheets` reads the sheet list without parsing any sheet.
    names = XLSX.read(bytes, { type: "array", bookSheets: true }).SheetNames;
    sheetNamesCache.set(bytes, names);
  }

  return names;
}

export async function parseExcelFile(
  bytes: Uint8Array,
  sheetIndex: number,
  requireHeader: string[] = [],
) {
  const XLSX = await loadXlsx();

  const sheetName = (await getSheetNames(XLSX, bytes))[sheetIndex - 1];

  if (!sheetName) {
    throw new Error("Sheet index not found");
  }

  // Parse ONLY the requested sheet (the file has one sheet per day).
  let workbook = XLSX.read(bytes, { type: "array", sheets: sheetName });
  let sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    // Defensive fallback: parse everything if the partial read found nothing.
    workbook = XLSX.read(bytes, { type: "array" });
    sheet = workbook.Sheets[sheetName];
  }

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
