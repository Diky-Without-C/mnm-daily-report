import { useEffect, useMemo, useState } from "react";
import { useSupabaseQuery } from "@/app/supabase/useSupabaseQuery";
import type { Report } from "@/app/supabase/report.dto";
import { useExcelParser } from "@/lib/xlsx/useExcelParser";
import type { ParsedReport } from "@/lib/xlsx/xlsx.type";
import { processData } from "@/features/report";
import { dataToText } from "@/features/report/helper/dataToText";
import { useLocalStorage } from "@/hooks/useLocaleStorage";
import { useDateStore } from "@/store/usetDate.store";
import { useOrdersStore } from "@/store/useOrders.store";
import { formatDate } from "@/utils/formatDate";

export default function useOrderPage() {
  const [file, setFile] = useState<File | null>(null);

  const { date, setDate } = useDateStore();
  const { orders, setOrders } = useOrdersStore();

  const [, setCodeHint] = useLocalStorage<string[]>("codeHint", []);
  const [cachedXlsx, setCachedXlsx] = useLocalStorage<ParsedReport[]>(
    "xlsx-data-report",
    [],
  );

  const { data: report } = useSupabaseQuery<Report>("report");
  const {
    data: [xlsx],
    loading,
    error,
  } = useExcelParser({
    file,
    sheetIndex: useMemo(() => [date.getDate()], [date]),
    content: "report",
  });

  const parsedData = xlsx?.length ? xlsx : cachedXlsx;

  useEffect(() => {
    if (report) {
      setOrders(report);
    }
  }, [report, setOrders]);

  useEffect(() => {
    if (xlsx?.length) {
      setCachedXlsx(xlsx);
    }
  }, [xlsx, setCachedXlsx]);

  useEffect(() => {
    if (!parsedData?.length) return;

    setCodeHint([...new Set(parsedData.map((v) => v.code))]);
  }, [parsedData, setCodeHint]);

  const text = useMemo(() => {
    if (!parsedData?.length) return "";

    return dataToText(processData(parsedData), formatDate(date), orders);
  }, [parsedData, date, orders]);

  const isReady = (!!file && !loading && !error) || cachedXlsx.length > 0;

  const content = useMemo(() => {
    if (!file) {
      return cachedXlsx.length
        ? text
        : "Upload an Excel file to generate today's report";
    }
    if (loading) return "loading ...";
    if (error) return error;
    return text;
  }, [file, cachedXlsx.length, text, loading, error]);

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
