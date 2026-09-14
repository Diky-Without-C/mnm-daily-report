import { useState, useCallback } from "react";
import { useOrders } from "@features/orders/hooks/useOrders";
import { usePagination } from "@features/orders/hooks/usePagination";
import { useSelection } from "@features/orders/hooks/useSelection";
import { ITEMS_PER_PAGE } from "@features/orders/order.constants";
import type { OrderTabs } from "@features/orders/order.type";

export function useCard() {
  const [currentTab, setcurrentTabs] = useState<OrderTabs>("all");
  const { orders, filter, sort, form, isDeleting, handlers } = useOrders({
    tabs: currentTab,
  });

  const pagination = usePagination({
    totalItems: orders.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const currentOrders = pagination.getPageItems(orders);
  const selection = useSelection({ items: currentOrders });

  const changeTab = useCallback(
    (nextMode: OrderTabs) => {
      setcurrentTabs(nextMode);
      pagination.setFirstPage();
      selection.clear();
    },
    [pagination, selection],
  );

  const search = useCallback(
    (value: string) => {
      pagination.setFirstPage();
      selection.clear();
      handlers.handleSearch(value);
    },
    [pagination, selection, handlers],
  );

  const deleteSelected = useCallback(() => {
    handlers.requestDelete(selection.selectedIds);
    selection.clear();
  }, [handlers, selection]);

  return {
    tabs: currentTab,
    filter,
    sort,
    currentOrders,
    selection,
    pagination,
    form,
    isDeleting,
    actions: {
      changeTab,
      search,
      add: handlers.handleAdd,
      edit: handlers.handleEdit,
      requestDelete: handlers.requestDelete,
      deleteSelected,
      closeForm: handlers.closeForm,
      changeForm: handlers.handleChange,
      submitForm: handlers.handleSubmit,
      confirmDelete: handlers.confirmDelete,
      cancelDelete: handlers.cancelDelete,
      filter: handlers.handleFilterChange,
      sort: handlers.handleSortChange,
    },
  };
}
