import { useEffect, useMemo } from "react";
import { useSupabaseQuery } from "@/app/supabase/useSupabaseQuery";
import type { Report } from "@/app/supabase/report.dto";
import { useExcelParser } from "@/lib/xlsx/useExcelParser";
import { processData } from "@/features/report";
import { reportToText } from "@/features/report/dataToText/report.text";
import usePersistedFile from "@/hooks/usePersistedFile";
import { useLocalStorage } from "@/hooks/useLocaleStorage";
import { useDateStore } from "@/store/usetDate.store";
import { useOrdersStore } from "@/store/useOrders.store";

export default function useOrderPage() {
  const [file, setFile] = usePersistedFile("mnm-xlsx-report-storage");

  const { date, setDate } = useDateStore();
  const { orders, setOrders } = useOrdersStore();

  const [, setCodeHint] = useLocalStorage<string[]>("codeHint", []);
  const { data: report } = useSupabaseQuery<Report>("report");
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
    if (report) {
      setOrders(report);
    }
  }, [report, setOrders]);

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
    if (!file) {
      return parsedData?.length
        ? text
        : "Upload an Excel file to generate today's report";
    }
    if (loading) return "loading ...";
    if (error) return error;
    return text;
  }, [file, parsedData?.length, text, loading, error]);

  return {
    file,
    setFile,
    date,
    setDate,
    text,
    content,
    loading,
    error,
    isReady,
  };
}
