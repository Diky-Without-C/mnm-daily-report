import { useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import type { OrderCategoryType } from "../../order.type";
import { usePagination } from "../../hooks/usePagination";
import { useSelection } from "../../hooks/useSelection";
import { ITEMS_PER_PAGE } from "../../order.constants";
import Table from "../Table";
import NotFound from "../NotFound";
import FormBox from "../DialogBox/FormBox";
import DeleteBox from "../DialogBox/DeleteBox";
import Toolbar from "./Toolbar";
import Footer from "./Footer";

export default function Card() {
  const [mode, setMode] = useState<OrderCategoryType>("pre order");
  const { orders, form, deleteBoxTrigger, handlers } = useOrders({ mode });

  const pagination = usePagination({
    totalItems: orders.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const currentOrders = pagination.getPageItems(orders);

  const selection = useSelection({
    items: currentOrders,
    getId: (order) => order.id,
  });

  const handleModeChange = (nextMode: OrderCategoryType) => {
    setMode(nextMode);
    pagination.setFirstPage();
    selection.clear();
  };

  const handleSearch = (value: string) => {
    pagination.setFirstPage();
    selection.clear();
    handlers.handleSearch(value);
  };

  const handleDeleteSelected = () => {
    handlers.requestDelete([...selection.selectedIds]);
    selection.clear();
  };

  return (
    <div className="flex h-full w-full flex-col">
      <Toolbar
        mode={mode}
        onModeChange={handleModeChange}
        onSearch={handleSearch}
        onAdd={handlers.handleAdd}
      />
      <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="min-h-0 flex-1">
          {currentOrders.length > 0 ? (
            <Table
              orders={currentOrders}
              selection={selection}
              onEdit={handlers.handleEdit}
              onDelete={handlers.requestDelete}
            />
          ) : (
            <NotFound />
          )}
        </div>
        <Footer
          selection={selection}
          pagination={pagination}
          onDeleteSelected={handleDeleteSelected}
        />
      </div>
      <FormBox
        open={Boolean(form)}
        form={form}
        onClose={handlers.closeForm}
        onChange={handlers.handleChange}
        onSubmit={handlers.handleSubmit}
      />
      <DeleteBox
        open={deleteBoxTrigger}
        onConfirm={handlers.confirmDelete}
        onCancel={handlers.cancelDelete}
      />
    </div>
  );
}
