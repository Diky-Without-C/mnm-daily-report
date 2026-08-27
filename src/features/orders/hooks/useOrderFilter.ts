import { useCallback, useEffect, useMemo, useState } from "react";
import type { Report } from "@apps/supabase/report.dto";
import { filterOrders, searchOrders, sortOrders } from "../order.helpers";
import type { OrderCategoryType, OrderFilters, OrderSort } from "../order.type";

interface UseOrderFilterParams {
  orders: Report[];
  mode: OrderCategoryType;
}

export function useOrderFilter({ orders, mode }: UseOrderFilterParams) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<OrderSort>("number-asc");
  const [filter, setFilter] = useState<OrderFilters>(() =>
    getInitialFilter(orders),
  );

  const modeOrders = useMemo(
    () => orders.filter((item) => item.category === mode),
    [orders, mode],
  );

  useEffect(() => {
    setFilter(getInitialFilter(modeOrders));
  }, [modeOrders]);

  const filteredOrders = useMemo(() => {
    const filteredByCategory = orders.filter((item) => item.category === mode);

    const sorted = sortOrders(filteredByCategory, sort);
    const filtered = filterOrders(sorted, filter);

    return searchOrders(filtered, search);
  }, [orders, mode, search, filter, sort]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleFilterChange = useCallback(
    (group: keyof OrderFilters, key: string, value: boolean) => {
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

  const handleSortChange = useCallback((value: OrderSort) => {
    setSort(value);
  }, []);

  return {
    orders: filteredOrders,
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

function getInitialFilter(orders: Report[]): OrderFilters {
  const types = [...new Set(orders.map((order) => order.type))];
  const from = [...new Set(orders.map((order) => order.from))];

  return {
    from: Object.fromEntries(from.map((value) => [value, true])),
    type: Object.fromEntries(types.map((value) => [value, true])),
  };
}
