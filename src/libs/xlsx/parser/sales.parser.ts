import { replaceItem } from "@features/report/utils/replaceItem";
import { SALES_ITEMS_TO_REPLACE } from "@constants/rules/sales.rules";
import { capitalize } from "@utils/capitalize";
import { clearWhiteSpace } from "@utils/clearWhiteSpace";
import { parseExcelFile } from "../xlsx.parser";
import type { ParsedSales } from "../xlsx.type";
import { schemas } from "./sales.schema";

const REQUIRED_COLUMNS = ["nama barang"];

export function parseSalesRows(
  headerRows: unknown[],
  contentRows: unknown[][],
  sheetName: string,
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

      const item = rawPacking ? `${rawItem} (${rawPacking})` : rawItem;
      const clearItem = replaceItem(
        clearWhiteSpace(item),
        SALES_ITEMS_TO_REPLACE,
      );
      const category = sheetName.trim().split(" ").map(capitalize).join(" ");

      const matchPacking = clearItem.match(/[([](.+?)[)\]]/);
      const packing = matchPacking?.[1];
      const clearPacking = packing?.toLowerCase();

      const matchCode = clearItem.match(/\b\D\D\s\d{3,4}/g);
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
  const { headerRows, contentRows, sheetName } = await parseExcelFile(
    bytes,
    sheetIndex,
    REQUIRED_COLUMNS,
  );

  return parseSalesRows(headerRows, contentRows, sheetName);
}
