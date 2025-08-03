import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { itemTypes } from "@constant/constant.json";

export interface Item {
  name: string;
  code: string;
  category: string;
  type: string;
  size: string;
  stock: string;
}

export default function useExcelParser(file: File | null, sheetIndex: number) {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setData([]);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const binary = e.target?.result;
        if (typeof binary !== "string") {
          throw new Error("Invalid file format");
        }

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
          throw new Error("Required columns not found in header row");
        }

        let currentCategory = "";

        const parsed: Item[] = contentRows
          .filter((row) => row.some((cell) => cell !== null && cell !== ""))
          .map((row) => {
            const item = row[itemIdx];
            const stock = String(row[stockIdx]) || "";

            if (!item?.includes(" - ")) {
              currentCategory = item;
              return;
            }

            const parts = item.trim().split(" - ");
            const [type, ...rest] = parts;
            const isHaveSize = item.match(/\dx\d/gi);
            const size = isHaveSize ? rest[rest.length - 1] : "";
            const code = rest[rest.length - (isHaveSize ? 2 : 1)].replace(
              " -",
              "",
            );
            const name = rest
              .slice(0, rest.length - (isHaveSize ? 2 : 1))
              .join(" ")
              .replace("LOKAL", "")
              .trim();

            return {
              name,
              type: itemTypes.includes(type) ? type : "",
              code,
              category: currentCategory.trim(),
              size,
              stock,
            };
          })
          .filter((item) => item !== undefined);

        setData(parsed);
      } catch (err: any) {
        setError(err?.message || "Failed to parse Excel file");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError(reader.error?.message || "File reading failed");
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  }, [file, sheetIndex]);

  return { data, loading, error };
}
