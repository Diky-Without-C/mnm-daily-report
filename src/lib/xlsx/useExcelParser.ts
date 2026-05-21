import { useEffect, useState } from "react";
import type { Contents, ParsedReport, ParsedSales } from "./xlsx.type";
import reportParser from "./parser/report.parser";
import salesParser from "./parser/sales.parser";

type ParserMap = {
  report: ParsedReport;
  sales: ParsedSales;
};

interface UseExcelParserProps<T extends Contents> {
  file: File | null;
  sheetIndex: number[];
  content: T;
}

const contentsToParser = {
  report: reportParser,
  sales: salesParser,
};

export function useExcelParser<T extends Contents>({
  file,
  sheetIndex,
  content,
}: UseExcelParserProps<T>) {
  const [data, setData] = useState<ParserMap[T][][]>([]);
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

        const parsedData = sheetIndex.map((idx) =>
          contentsToParser[content](bytes, idx),
        ) as ParserMap[T][][];

        setData(parsedData);
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
