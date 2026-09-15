import { useCallback, useEffect, useMemo, useState } from "react";
import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import { filterOrders, searchOrders, sortOrders } from "../order.helpers";
import type { OrderFilters, OrderSort } from "../order.type";

interface UseOrderFilterParams {
  orders: OrderSchema[];
}

export function useOrderFilter({ orders }: UseOrderFilterParams) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<OrderSort>("number-asc");
  const [filter, setFilter] = useState<OrderFilters>(() =>
    getInitialFilter(orders),
  );

  useEffect(() => {
    setFilter(getInitialFilter(orders));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const sorted = sortOrders(orders, sort);
    const filtered = filterOrders(sorted, filter);

    return searchOrders(filtered, search);
  }, [orders, search, filter, sort]);

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

function getInitialFilter(orders: OrderSchema[]): OrderFilters {
  const types = [...new Set(orders.map((order) => order.type))];
  const from = [...new Set(orders.map((order) => order.from))];

  return {
    from: Object.fromEntries(from.map((value) => [value, true])),
    type: Object.fromEntries(types.map((value) => [value, true])),
  };
}
