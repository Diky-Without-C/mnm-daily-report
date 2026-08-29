import { useCallback, useMemo } from "react";
import { usePagination } from "@features/sales/hooks/usePagination";
import useSales from "@features/sales/hooks/useSales";
import {
  createEmptySales,
  processingSales,
} from "@features/sales/sales.helper";
import { ITEMS_PER_PAGE } from "@features/sales/sales.constant";
import type { ProcessedSale } from "@features/sales/sales.type";

export function useCard() {
  const { sales, filter, sort, handlers } = useSales();

  const pagination = usePagination({
    totalItems: sales.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const pages = pagination.getPageItems(sales);
  const currentSales = useMemo(() => {
    return [
      ...processingSales(pages),
      ...createEmptySales(ITEMS_PER_PAGE - pages.length),
    ] as ProcessedSale[];
  }, [pages]);

  const search = useCallback(
    (value: string) => {
      pagination.setFirstPage();
      handlers.handleSearch(value);
    },
    [pagination, handlers],
  );

  return {
    currentSales,
    filter,
    sort,
    pagination,
    actions: {
      search,
      filter: handlers.handleFilterChange,
      sort: handlers.handleSortChange,
    },
  };
}
