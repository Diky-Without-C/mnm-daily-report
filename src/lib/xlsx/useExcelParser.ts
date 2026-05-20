import { useEffect, useState } from "react";
import type { Contents, ParsedItem } from "./xlsx.type";
import reportParser from "./report.parser";

const contentsToParser: Record<Contents, typeof reportParser> = {
  report: reportParser,
};

export function useExcelParser(
  file: File | null,
  sheetIndex: number,
  content: Contents,
) {
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
        const buffer = e.target?.result;

        if (!(buffer instanceof ArrayBuffer)) {
          throw new Error("Invalid file");
        }

        const bytes = new Uint8Array(buffer);

        setData(contentsToParser[content](bytes, sheetIndex));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);

    return () => {
      reader.abort();
    };
  }, [file, sheetIndex, content]);

  return { data, loading, error };
}
