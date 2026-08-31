import Table from "../Table";
import NotFound from "../NotFound";
import FormBox from "../DialogBox/FormBox";
import DeleteBox from "../DialogBox/DeleteBox";
import Toolbar from "./Toolbar";
import Footer from "./Footer";
import { useCard } from "./useCard";
import Divider from "@components/Divider";
import Tabs from "@components/Tabs";
import { ORDER_CATEGORY } from "@features/orders/order.constants";

export default function Card() {
  const {
    mode,
    filter,
    sort,
    currentOrders,
    selection,
    pagination,
    form,
    isDeleting,
    actions,
  } = useCard();

  return (
    <div className="flex h-full w-full flex-col">
      <Toolbar
        onSearch={actions.search}
        onAdd={actions.add}
        filter={filter}
        onFilter={actions.filter}
        sort={sort}
        onSort={actions.sort}
      />
      <div className="flex h-full w-full flex-col overflow-hidden">
        <Tabs
          items={Object.values(ORDER_CATEGORY)}
          value={mode}
          onChange={actions.changeMode}
        />
        <div className="min-h-0 flex-1">
          {currentOrders.length > 0 ? (
            <Table
              orders={currentOrders}
              selection={selection}
              onEdit={actions.edit}
              onDelete={actions.requestDelete}
            />
          ) : (
            <NotFound />
          )}
        </div>
        <Divider className="h-[2px]" />
        <Footer
          selection={selection}
          pagination={pagination}
          onDeleteSelected={actions.deleteSelected}
        />
      </div>
      <FormBox
        open={Boolean(form)}
        form={form}
        onClose={actions.closeForm}
        onChange={actions.changeForm}
        onSubmit={actions.submitForm}
      />
      <DeleteBox
        open={isDeleting}
        onConfirm={actions.confirmDelete}
        onCancel={actions.cancelDelete}
      />
    </div>
  );
}
