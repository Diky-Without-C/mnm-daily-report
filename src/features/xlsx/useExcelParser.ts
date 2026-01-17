import { useEffect, useState } from "react";
import { parseExcelFile } from "./xlsx.parser";
import type { ParsedItem } from "./xlsx.type";

export function useExcelParser(file: File | null, sheetIndex: number) {
  const [data, setData] = useState<ParsedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    setLoading(true);
    setError(null);

    reader.onload = (e) => {
      try {
        const binary = e.target?.result;
        if (typeof binary !== "string") throw new Error("Invalid file");
        setData(parseExcelFile(binary, sheetIndex));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  }, [file, sheetIndex]);

  return { data, loading, error };
}
