import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { itemTypes } from "@constant/constant.json";

export interface Item {
  name: string;
  code: string;
  category: string;
  type: string;
  size: string;
  weight: string;
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

        const codes = {
          MC: "- MC",
          MD: "- MD",
          MF: "- MF",
          SR: "- SR",
          FC: "- FC",
          RM: "- RM",
        };

        const parsed: Item[] = contentRows
          .filter((row) => row.some((cell) => cell !== null && cell !== ""))
          .map((row) => {
            const item = row[itemIdx];
            const stock = String(row[stockIdx]) || "";

            if (!item?.includes(" - ")) {
              currentCategory = item;
              return;
            }

            let updatedItem = item.replace("LOKAL", "").trim();
            for (const key in codes) {
              const value = codes[key as keyof typeof codes];
              updatedItem = updatedItem.replace(` ${key}`, ` ${value}`);
            }

            const parts = updatedItem.split(" - ");
            const [rawType, ...rest] = parts;

            let size = "";
            let weight = "";
            let code = "";
            let name = "";

            const restCopy = [...rest];

            const last = restCopy[restCopy.length - 1];
            if (/\d+(gr|g|c)/i.test(last)) {
              weight = restCopy.pop()!;
            }

            const secondLast = restCopy[restCopy.length - 1];
            if (/\d+x\d+/i.test(secondLast)) {
              size = restCopy.pop()!;
            }

            code = restCopy.pop() || "";

            const rawName = restCopy.join(" ").trim();
            name = rawName.includes("TOPBLADE")
              ? `${rawName} ${code.slice(2)}`
              : rawName;

            const type = rawType in itemTypes ? rawType : "";

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
