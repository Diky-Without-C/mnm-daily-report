import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import Divider from "@components/Divider";
import Tabs from "@components/Tabs";
import Table from "../Table";
import NotFound from "../NotFound";
import Form from "../Modal/FormBox";
import DeleteBox from "../Modal/DeleteBox";
import Toolbar from "./Toolbar";
import Footer from "./Footer";
import { useCard } from "./useCard";
import { ORDER_TABS } from "@features/orders/order.constants";

interface CardProps {
  onSelect?: (order: OrderSchema) => void;
}

export default function Card({ onSelect }: CardProps) {
  const { tab, orders, filter, form, deletion, pagination, selection } =
    useCard();

  return (
    <div className="flex h-full w-full flex-col">
      <Toolbar
        onSearch={filter.search}
        onAdd={form.add}
        filter={filter.value}
        onFilter={filter.filterChange}
        sort={filter.sort}
        onSort={filter.sortChange}
      />
      <div className="flex h-full w-full flex-col overflow-hidden">
        <Tabs items={ORDER_TABS} value={tab.value} onChange={tab.change} />
        <div className="min-h-0 flex-1">
          {orders.data.length > 0 ? (
            <Table
              orders={orders.data}
              selection={selection}
              form={form}
              deletion={deletion}
              onSelect={onSelect}
            />
          ) : (
            <NotFound />
          )}
        </div>
        <Divider className="h-[2px]" />
        <Footer
          selection={selection}
          pagination={pagination}
          deletion={deletion}
        />
      </div>
      <Form
        open={Boolean(form.data)}
        onClose={form.reset}
        form={form.data}
        error={form.error}
        onChange={form.change}
        onSubmit={form.submit}
      />
      <DeleteBox
        open={deletion.isDeleting}
        onConfirm={deletion.confirm}
        onCancel={deletion.cancel}
      />
    </div>
  );
}
