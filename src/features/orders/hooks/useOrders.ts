import { useOrdersStore } from "@stores/useOrders.store";
import { useOrderFilter } from "./useOrderFilter";
import { useOrderForm } from "./useOrderForm";
import { useOrderDeletion } from "./useOrderDeletion";
import type { OrderTabs } from "../order.type";

interface UseOrdersParams {
  tabs: OrderTabs;
}

export function useOrders({ tabs }: UseOrdersParams) {
  const { orders: ordersStore, setOrders } = useOrdersStore();

  const currentTabs = tabs === "all" ? "pre order" : tabs;
  const filter = useOrderFilter({ orders: ordersStore });
  const form = useOrderForm({ category: currentTabs, setOrders });
  const deletion = useOrderDeletion({ setOrders });
  const currentOrders = filter.orders.filter(
    (order) => order.category === tabs || tabs === "all",
  );

  return {
    orders: currentOrders,
    filter: filter.filter,
    sort: filter.sort,
    form: form.form,
    isDeleting: deletion.isDeleting,
    handlers: {
      ...filter.handlers,
      ...form.handlers,
      ...deletion.handlers,
    },
  };
}
