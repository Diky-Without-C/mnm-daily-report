import { useMemo } from "react";
import { processData } from "@features/report";
import { reportToText } from "@features/report/dataToText/report.text";
import { usePersistedFile } from "@hooks/usePersistedFile";
import { useExcelParser } from "@libs/xlsx/useExcelParser";
import { useDateStore } from "@stores/usetDate.store";
import { useOrdersStore } from "@stores/useOrders.store";

export default function useSalesPage() {
  const [file, setFile] = usePersistedFile("mnm-xlsx-sales-storage");
  const [reportFile] = usePersistedFile("mnm-xlsx-report-storage");

  const { date, setDate } = useDateStore();
  const { orders } = useOrdersStore();

  const {
    data: sales,
    loading: salesloading,
    error: salesError,
  } = useExcelParser({
    file,
    sheetIndex: [1, 2, 3, 4],
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

  const content = useMemo(() => {
    if (!parsedData?.length) return "No cached report data";
    if (reportLoading || salesloading) return "loading ...";
    if (reportError || salesError)
      return salesError || reportError || "Error loading data";

    return sales[0]
      ? reportToText(processData(parsedData), date, orders, sales.flat())
      : "No sales data available";
  }, [
    parsedData,
    reportLoading,
    salesloading,
    reportError,
    salesError,
    sales,
    date,
    orders,
  ]);

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
    content,
    isReady,
    date,
    setDate,
  };
}
