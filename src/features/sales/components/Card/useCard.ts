import { useCallback, useMemo, useState } from "react";
import { usePagination } from "@features/sales/hooks/usePagination";
import useSales from "@features/sales/hooks/useSales";
import {
  createEmptySales,
  processingSales,
} from "@features/sales/sales.helper";
import { SALES_ITEMS_PER_PAGE } from "@constants/Sales";
import type { ProcessedSale, SalesTabs } from "@features/sales/sales.type";
import { usePersistedFile } from "@hooks/usePersistedFile";
import { FILE_KEYS } from "@constants/App";

export function useCard() {
  const [currentTab, setcurrentTabs] = useState<SalesTabs>("all");
  const { sales, filter, sort, handlers } = useSales({ tabs: currentTab });
  const { setFile } = usePersistedFile(FILE_KEYS.sales);

  const pagination = usePagination({
    totalItems: sales.length,
    itemsPerPage: SALES_ITEMS_PER_PAGE,
  });

  const changeTab = useCallback(
    (nextMode: string) => {
      setcurrentTabs(nextMode as SalesTabs);
      pagination.setFirstPage();
    },
    [pagination],
  );

  const pages = pagination.getPageItems(sales);
  const currentSales = useMemo(() => {
    return [
      ...processingSales(pages),
      ...createEmptySales(SALES_ITEMS_PER_PAGE - pages.length),
    ] as ProcessedSale[];
  }, [pages]);

  const search = useCallback(
    (value: string) => {
      pagination.setFirstPage();
      handlers.search(value);
    },
    [pagination, handlers],
  );

  const changeFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      setFile(file);
    },
    [setFile],
  );

  return {
    tabs: currentTab,
    currentSales,
    filter,
    sort,
    pagination,
    actions: {
      search,
      filter: handlers.filter,
      sort: handlers.sort,
      changeTab,
      changeFile,
    },
  };
}
