import { useOrdersStore } from "@stores/useOrders.store";
import type { OrderTabs } from "../order.type";
import { useOrderFilter } from "./useOrderFilter";

interface UseOrdersParams {
  tabs: OrderTabs;
}

export function useOrders({ tabs }: UseOrdersParams) {
  const orders = useOrdersStore((state) => state.orders);

  const filter = useOrderFilter({
    orders,
  });

  const currentOrders = filter.orders.filter(
    (order) => tabs === "all" || order.category === tabs,
  );

  return {
    data: currentOrders,
    filter: {
      value: filter.filter,
      sort: filter.sort,
      search: filter.searchOrder,
      filterChange: filter.filterChange,
      sortChange: filter.sortChange,
    },
  };
}
