import { useEffect, useMemo } from "react";
import { processData } from "@features/report";
import { reportToText } from "@features/report/dataToText/report.text";
import { usePersistedFile } from "@hooks/usePersistedFile";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { useExcelParser } from "@libs/xlsx/useExcelParser";
import { useDateStore } from "@stores/useDate.store";
import { useOrdersStore } from "@stores/useOrders.store";
import { FILE_KEYS, LOCAL_STORAGE_KEYS } from "@constants/App";

export default function useOrderPage() {
  const { file, setFile } = usePersistedFile(FILE_KEYS.report);
  const { date, setDate } = useDateStore();
  const orders = useOrdersStore((state) => state.orders);
  const [, setCodeHint] = useLocalStorage<string[]>(LOCAL_STORAGE_KEYS.codeHints, []);

  const {
    data: [parsedData],
    loading,
    error,
  } = useExcelParser({
    file,
    sheetIndex: useMemo(() => [date.getDate()], [date]),
    content: "report",
  });

  useEffect(() => {
    if (!parsedData?.length) return;

    setCodeHint([...new Set(parsedData.map((v) => v.code))]);
  }, [parsedData, setCodeHint]);

  const text = useMemo(() => {
    if (!parsedData?.length) return "";

    return reportToText(processData(parsedData), date, orders);
  }, [parsedData, date, orders]);

  const isReady = !!file && !loading && !error;

  const content = useMemo(() => {
    if (!file) return "Upload an Excel file to generate today's report";
    if (loading) return "loading ...";
    if (error) return error;
    return text;
  }, [file, text, loading, error]);

  return {
    file,
    setFile,
    date,
    setDate,
    text: content,
    content,
    loading,
    error,
    isReady,
  };
}
