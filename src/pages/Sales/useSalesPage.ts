import { useMemo } from "react";
import { processData } from "@features/report";
import { reportToText } from "@features/report/dataToText/report.text";
import { usePersistedFile } from "@hooks/usePersistedFile";
import { useExcelParser } from "@libs/xlsx/useExcelParser";
import { useDateStore } from "@stores/useDate.store";
import { useOrdersStore } from "@stores/useOrders.store";
import { FILE_KEYS } from "@constants/App";

export default function useSalesPage() {
  const { file: salesfile } = usePersistedFile(FILE_KEYS.sales);
  const { file, setFile } = usePersistedFile(FILE_KEYS.report);

  const { date, setDate } = useDateStore();
  const orders = useOrdersStore((state) => state.orders);

  const {
    data: sales,
    loading: salesLoading,
    error: salesError,
  } = useExcelParser({
    file: salesfile,
    sheetIndex: useMemo(() => [1, 2, 3, 4], []),
    content: "sales",
  });

  const {
    data: [parsedData],
    loading: reportLoading,
    error: reportError,
  } = useExcelParser({
    file: file,
    sheetIndex: useMemo(() => [date.getDate()], [date]),
    content: "report",
  });

  const content = useMemo(() => {
    if (!parsedData?.length) return "No cached report data";
    if (reportLoading || salesLoading) return "loading ...";
    if (reportError || salesError)
      return salesError || reportError || "Error loading data";

    return sales[0]
      ? reportToText(processData(parsedData), date, orders, sales.flat())
      : "No sales data available";
  }, [
    parsedData,
    reportLoading,
    salesLoading,
    reportError,
    salesError,
    sales,
    date,
    orders,
  ]);

  const isReady =
    !salesLoading &&
    !salesError &&
    !reportLoading &&
    !reportError &&
    !!sales.length;

  return {
    file,
    setFile,
    sales,
    loading: salesLoading || reportLoading,
    error: salesError || reportError,
    content,
    text: content,
    isReady,
    date,
    setDate,
  };
}
