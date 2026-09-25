import { useCallback, useState } from "react";
import { useOrders } from "@features/orders/hooks/useOrders";
import { useOrderForm } from "@features/orders/components/Modal/FormBox/useOrderForm";
import { useOrderDeletion } from "@features/orders/hooks/useOrderDeletion";
import { usePagination } from "@features/orders/hooks/usePagination";
import { useSelection } from "@features/orders/hooks/useSelection";
import { ITEMS_PER_PAGE } from "@features/orders/order.constants";
import type { OrderTabs } from "@features/orders/order.type";

export function useCard() {
  const [tab, setTab] = useState<OrderTabs>("all");

  const orders = useOrders({ tabs: tab });
  const form = useOrderForm();
  const deletion = useOrderDeletion();

  const pagination = usePagination({
    totalItems: orders.data.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const currentOrders = pagination.getPageItems(orders.data);
  const selection = useSelection({ items: currentOrders });

  const changeTab = useCallback(
    (nextTab: OrderTabs) => {
      setTab(nextTab);
      pagination.setFirstPage();
      selection.clear();
    },
    [pagination, selection],
  );

  const search = useCallback(
    (value: string) => {
      pagination.setFirstPage();
      selection.clear();

      orders.filter.search(value);
    },
    [orders.filter, pagination, selection],
  );

  const deleteSelected = useCallback(() => {
    if (selection.selectedIds.length === 0) {
      return;
    }

    deletion.request(selection.selectedIds);
    selection.clear();
  }, [deletion, selection]);

  return {
    tab: {
      value: tab,
      change: changeTab,
    },
    orders: {
      data: currentOrders,
      all: orders.data,
    },
    filter: {
      value: orders.filter.value,
      sort: orders.filter.sort,
      search,
      filterChange: orders.filter.filterChange,
      sortChange: orders.filter.sortChange,
    },
    form,
    deletion: {
      ...deletion,
      deleteSelected,
    },
    pagination,
    selection,
  };
}
