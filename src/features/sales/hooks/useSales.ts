import { useMemo } from "react";
import { usePersistedFile } from "@hooks/usePersistedFile";
import { useExcelParser } from "@libs/xlsx/useExcelParser";
import { useSalesFilter } from "./useFilterSales";
import type { SalesTabs } from "../sales.type";

interface UseSalesProps {
  tabs: SalesTabs;
}

export default function useSales({ tabs }: UseSalesProps) {
  const { file } = usePersistedFile("mnm-xlsx-sales-storage");

  const { data: sales } = useExcelParser({
    file,
    sheetIndex: useMemo(() => [1, 2, 3, 4], []),
    content: "sales",
  });

  const currentSales = useMemo(() => {
    return sales
      .flat()
      .filter((sale) => sale.category.toLowerCase() === tabs || tabs === "all");
  }, [sales, tabs]);

  const filter = useSalesFilter({
    sales: currentSales,
  });

  return {
    sales: filter.sales,
    filter: filter.filter,
    sort: filter.sort,
    handlers: {
      filter: filter.filterChange,
      sort: filter.sortChange,
      search: filter.searchSale,
    },
  };
}
