import Divider from "@components/Divider";
import Tabs from "@components/Tabs";
import Table from "../Table";
import NotFound from "../NotFound";
import FormBox from "../Modal/FormBox";
import DeleteBox from "../Modal/DeleteBox";
import Toolbar from "./Toolbar";
import Footer from "./Footer";
import { useCard } from "./useCard";
import { ORDER_TABS } from "@features/orders/order.constants";

export default function Card() {
  const {
    tabs,
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
        <Tabs items={ORDER_TABS} value={tabs} onChange={actions.changeTab} />
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
