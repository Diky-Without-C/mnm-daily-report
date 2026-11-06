import { useEffect, useState } from "react";
import { parseSheet } from "./parseCache";
import type { Contents, ParserMap } from "./xlsx.type";

interface UseExcelParserProps<T extends Contents> {
  file: File | null;
  sheetIndex: number[];
  content: T;
}

export function useExcelParser<T extends Contents>({
  file,
  sheetIndex,
  content,
}: UseExcelParserProps<T>) {
  const [data, setData] = useState<ParserMap[T][][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // No file (removed / not uploaded yet): drop any previous result.
    if (!file) {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);

    Promise.all(sheetIndex.map((idx) => parseSheet(file, content, idx)))
      .then((parsed) => {
        if (cancelled) return;
        setData(parsed);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setData([]);
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [file, sheetIndex, content]);

  return { data, loading, error };
}
