import { useEffect, useMemo, useState } from "react";
import { useExcelParser } from "@/lib/xlsx/useExcelParser";
import type { ParsedReport, ParsedSales } from "@/lib/xlsx/xlsx.type";
import { useSalesStore } from "@/store/useSales.store";
import { useDateStore } from "@/store/usetDate.store";
import { useOrdersStore } from "@/store/useOrders.store";
import { useLocalStorage } from "@/hooks/useLocaleStorage";
import { processData } from "@/features/report";
import { reportToText } from "@/features/report/dataToText/report.text";
import { SALES_SHEET_INDEX } from "@/features/MPO/sales.constant";

export default function useSalesPage() {
  const [file, setFile] = useState<File | null>(null);

  const { date, setDate } = useDateStore();
  const { orders } = useOrdersStore();
  const { setSales } = useSalesStore();

  const [cachedSalesXlsx, setCachedSales] = useLocalStorage<ParsedSales[][]>(
    "xlsx-data-sales",
    [],
  );
  const [cachedReportXlsx] = useLocalStorage<ParsedReport[]>(
    "xlsx-data-report",
    [],
  );

  const {
    data: sales,
    loading,
    error,
  } = useExcelParser({
    file,
    sheetIndex: SALES_SHEET_INDEX,
    content: "sales",
  });

  useEffect(() => {
    if (!sales.length) return;

    setSales(sales);
    setCachedSales(sales);
  }, [sales, setSales, setCachedSales]);

  const currentSales = useMemo(
    () => (sales.length ? sales.flat() : cachedSalesXlsx.flat()),
    [sales, cachedSalesXlsx],
  );

  const previewText = useMemo(() => {
    if (!cachedReportXlsx.length) return "No cached report data";
    if (loading) return "loading ...";
    if (error) return error;

    return reportToText(
      processData(cachedReportXlsx),
      date,
      orders,
      currentSales,
    );
  }, [cachedReportXlsx, date, orders, currentSales, loading, error]);

  const isReady = cachedReportXlsx.length > 0 && !loading && !error;

  return {
    file,
    setFile,
    sales,
    loading,
    error,
    previewText,
    isReady,
    date,
    setDate,
  };
}
