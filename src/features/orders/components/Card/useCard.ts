import { useState, useCallback } from "react";
import { useOrders } from "@features/orders/hooks/useOrders";
import { usePagination } from "@features/orders/hooks/usePagination";
import { useSelection } from "@features/orders/hooks/useSelection";
import { ITEMS_PER_PAGE } from "@features/orders/order.constants";
import type { OrderCategoryType } from "@features/orders/order.type";

export function useCard() {
  const [mode, setMode] = useState<OrderCategoryType>("pre order");
  const { orders, filter, sort, form, isDeleting, handlers } = useOrders({
    mode,
  });

  const pagination = usePagination({
    totalItems: orders.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const currentOrders = pagination.getPageItems(orders);
  const selection = useSelection({ items: currentOrders });

  const changeMode = useCallback(
    (nextMode: OrderCategoryType) => {
      setMode(nextMode);
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
    handlers.requestDelete(Array.from(selection.selectedIds));
    selection.clear();
  }, [handlers, selection]);

  return {
    mode,
    filter,
    sort,
    currentOrders,
    selection,
    pagination,
    form,
    isDeleting,
    actions: {
      changeMode,
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
