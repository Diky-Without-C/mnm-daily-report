import { useMemo } from "react";
import { processData } from "@features/report";
import { reportToText } from "@features/report/dataToText/report.text";
import { SALES_SHEET_INDEX } from "@features/sales/sales.constant";
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

  const content = useMemo(() => {
    if (!parsedData?.length) return "No cached report data";
    if (reportLoading) return "loading ...";
    if (reportError) return reportError;

    return sales[0]
      ? reportToText(processData(parsedData), date, orders, sales.flat())
      : "No sales data available";
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
    content,
    isReady,
    date,
    setDate,
  };
}
