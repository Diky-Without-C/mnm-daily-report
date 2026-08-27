import { useOrdersStore } from "@stores/useOrders.store";
import { useOrderFilter } from "./useOrderFilter";
import { useOrderForm } from "./useOrderForm";
import { useOrderDeletion } from "./useOrderDeletion";
import type { OrderCategoryType } from "../order.type";

interface UseOrdersParams {
  mode: OrderCategoryType;
}

export function useOrders({ mode }: UseOrdersParams) {
  const { orders: ordersStore, setOrders } = useOrdersStore();

  const filter = useOrderFilter({ orders: ordersStore, mode });
  const form = useOrderForm({ mode, setOrders });
  const deletion = useOrderDeletion({ setOrders });

  return {
    orders: filter.orders,
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
