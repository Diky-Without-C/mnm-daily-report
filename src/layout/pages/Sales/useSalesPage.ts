import { useEffect, useMemo } from "react";
import { useExcelParser } from "@/lib/xlsx/useExcelParser";
import { useSalesStore } from "@/store/useSales.store";
import { useDateStore } from "@/store/usetDate.store";
import { useOrdersStore } from "@/store/useOrders.store";
import usePersistedFile from "@/hooks/usePersistedFile";
import { processData } from "@/features/report";
import { reportToText } from "@/features/report/dataToText/report.text";
import { SALES_SHEET_INDEX } from "@/features/MPO/sales.constant";

export default function useSalesPage() {
  const [file, setFile] = usePersistedFile("mnm-xlsx-sales-storage");
  const [reportFile] = usePersistedFile("mnm-xlsx-report-storage");

  const { date, setDate } = useDateStore();
  const { orders } = useOrdersStore();
  const { setSales } = useSalesStore();

  const {
    data: sales,
    loading: salesloading,
    error: salesError,
  } = useExcelParser({
    file,
    sheetIndex: SALES_SHEET_INDEX,
    content: "sales",
  });

  const {
    data: [parsedData],
    loading: reportLoading,
    error: reportError,
  } = useExcelParser({
    file: reportFile,
    sheetIndex: useMemo(() => [date.getDate()], [date]),
    content: "report",
  });

  useEffect(() => {
    if (!sales.length) return;

    setSales(sales);
  }, [sales, setSales]);

  const previewText = useMemo(() => {
    if (!parsedData?.length) return "No cached report data";
    if (reportLoading) return "loading ...";
    if (reportError) return reportError;

    return reportToText(processData(parsedData), date, orders, sales.flat());
  }, [parsedData, reportLoading, reportError, date, orders, sales]);

  const isReady =
    !salesloading &&
    !salesError &&
    !reportLoading &&
    !reportError &&
    !!sales.length;

  return {
    file,
    setFile,
    sales,
    loading: salesloading,
    error: salesError,
    previewText,
    isReady,
    date,
    setDate,
  };
}
