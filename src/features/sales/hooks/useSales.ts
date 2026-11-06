import { useMemo } from "react";
import { usePersistedFile } from "@hooks/usePersistedFile";
import { normalizeCategory } from "@features/report/utils/normalizeCategory";
import { useExcelParser } from "@libs/xlsx/useExcelParser";
import { useSalesFilter } from "./useFilterSales";
import type { SalesTabs } from "../sales.type";
import { FILE_KEYS } from "@constants/App";

interface UseSalesProps {
  tabs: SalesTabs;
}

export default function useSales({ tabs }: UseSalesProps) {
  const { file } = usePersistedFile(FILE_KEYS.sales);

  const { data: sales } = useExcelParser({
    file,
    sheetIndex: useMemo(() => [1, 2, 3, 4], []),
    content: "sales",
  });

  const currentSales = useMemo(() => {
    return sales
      .flat()
      .filter(
        (sale) => tabs === "all" || normalizeCategory(sale.category) === tabs,
      );
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
