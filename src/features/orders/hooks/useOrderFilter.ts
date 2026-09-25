import { useCallback, useEffect, useMemo, useState } from "react";
import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import type { MultipleField, SingleField } from "@constants/Order";
import { filterOrders, searchOrders, sortOrders } from "../order.helpers";

interface UseOrderFilterParams {
  orders: OrderSchema[];
}

export function useOrderFilter({ orders }: UseOrderFilterParams) {
  const [search, setSearch] = useState("");
  const [sort, setSort] =
    useState<Record<string, SingleField>>(getInitialSort());
  const [filter, setFilter] = useState<Record<string, MultipleField>>(
    getInitialFilter(orders),
  );

  useEffect(() => {
    setFilter(getInitialFilter(orders));
    setSort(getInitialSort());
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const sorted = sortOrders(orders, sort);
    const filtered = filterOrders(sorted, filter);

    return searchOrders(filtered, search);
  }, [orders, search, filter, sort]);

  const searchOrder = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const filterChange = useCallback(
    (group: string, selectedValue: MultipleField["selectedValue"]) => {
      setFilter((prev) => ({
        ...prev,
        [group]: {
          ...prev[group],
          selectedValue: selectedValue as MultipleField["selectedValue"],
        },
      }));
    },
    [],
  );

  const sortChange = useCallback(
    (group: string, selectedValue: SingleField["selectedValue"]) => {
      setSort((prev) => ({
        ...prev,
        [group]: {
          ...prev[group],
          selectedValue,
        },
      }));
    },
    [],
  );

  return {
    orders: filteredOrders,
    search,
    filter,
    sort,
    searchOrder,
    filterChange,
    sortChange,
  };
}

function getInitialFilter(
  orders: OrderSchema[],
): Record<string, MultipleField> {
  const types = [...new Set(orders.map((order) => order.type))];
  const from = [...new Set(orders.map((order) => order.from))];

  const result = {
    from: {
      type: "multiple",
      selectedValue: from,
      options: from.map((value) => ({
        label: value,
        value,
      })),
    },
    type: {
      type: "multiple",
      selectedValue: types,
      options: types.map((value) => ({
        label: value,
        value,
      })),
    },
  };

  return result as Record<string, MultipleField>;
}

function getInitialSort(): Record<string, SingleField> {
  const field = ["number", "amount", "type"];
  const direction = ["ascending", "descending"];

  const result = {
    field: {
      type: "single",
      selectedValue: "number",
      options: field.map((value) => ({
        label: value,
        value,
      })),
    },
    direction: {
      type: "single",
      selectedValue: "ascending",
      options: direction.map((value) => ({
        label: value,
        value,
      })),
    },
  };

  return result as Record<string, SingleField>;
}
