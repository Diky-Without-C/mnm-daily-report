import { useMemo } from "react";
import { usePersistedFile } from "@hooks/usePersistedFile";
import { useExcelParser } from "@libs/xlsx/useExcelParser";
import { useSalesFilter } from "./useFilterSales";

export default function useSales() {
  const [file] = usePersistedFile("mnm-xlsx-sales-storage");

  const { data: sales } = useExcelParser({
    file,
    sheetIndex: useMemo(() => [1, 2, 3, 4], []),
    content: "sales",
  });

  const filter = useSalesFilter({
    sales: useMemo(() => sales.flat(), [sales]),
  });

  return {
    sales: filter.sales,
    filter: filter.filter,
    sort: filter.sort,
    handlers: {
      ...filter.handlers,
    },
  };
}
