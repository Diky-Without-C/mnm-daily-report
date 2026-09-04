import { useCallback, useEffect, useMemo, useState } from "react";
import type { ParsedSales } from "@libs/xlsx/xlsx.type";
import type { SalesFilter, SalesSort } from "../sales.type";
import { filterSales, searchSales, sortSales } from "../sales.helper";

interface UseOrderFilterParams {
  sales: ParsedSales[];
}

export function useSalesFilter({ sales }: UseOrderFilterParams) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SalesSort>("monthly-desc");
  const [filter, setFilter] = useState<SalesFilter>(() =>
    getInitialFilter(sales),
  );

  useEffect(() => {
    setFilter(getInitialFilter(sales));
  }, [sales]);

  const filteredSales = useMemo(() => {
    const sorted = sortSales(sales, sort);
    const filtered = filterSales(sorted, filter);

    return searchSales(filtered, search);
  }, [filter, sales, search, sort]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleFilterChange = useCallback(
    (group: keyof SalesFilter, key: string, value: boolean) => {
      setFilter((prev) => ({
        ...prev,
        [group]: {
          ...prev[group],
          [key]: value,
        },
      }));
    },
    [],
  );

  const handleSortChange = useCallback((value: SalesSort) => {
    setSort(value);
  }, []);

  return {
    sales: filteredSales,
    search,
    filter,
    sort,
    handlers: {
      handleSearch,
      handleFilterChange,
      handleSortChange,
    },
  };
}

function getInitialFilter(sales: ParsedSales[]): SalesFilter {
  const packing = [...new Set(sales.map((sale) => sale.packing))];

  return {
    packing: Object.fromEntries(packing.map((value) => [value, true])),
  };
}
