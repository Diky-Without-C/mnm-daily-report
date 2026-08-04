import type { Report } from "@apps/supabase/report.dto";
import SearchBar from "@components/SearchBar";
import Button from "@components/Button";
import Add from "@components/Icons/Add";
import Kebab from "@components/Icons/Kebab";
import { useOrders } from "../../useOrders";
import { getOrderLabel } from "../../order.helpers";
import type { OrderCategoryType } from "../../order.type";
import FormBox from "../DialogBox/FormBox";
import DeleteBox from "../DialogBox/DeleteBox";
import ActionMenu from "./ActionMenu";

interface OrderPageProps {
  mode: OrderCategoryType;
  setSelectedOrder?(order: Report): void;
}

export default function OrderCard({ mode, setSelectedOrder }: OrderPageProps) {
  const { orders, form, deleteBoxTrigger, handlers } = useOrders({ mode });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold capitalize">{mode}</h1>
        <div className="flex gap-1">
          <Button variant="info" onClick={handlers.handleAdd} className="p-1.5">
            <Add />
          </Button>
          <Button variant="transparent" className="p-1.5">
            <Kebab />
          </Button>
        </div>
      </div>
      <div className="flex w-full border-b-2 border-gray-300 pb-4">
        <SearchBar onSearch={handlers.handleSearch} />
      </div>
      <ul className="mt-2 flex h-full flex-col items-center overflow-y-auto">
        {orders.length ? (
          orders.map((order) => (
            <li
              key={order.id}
              onClick={() => setSelectedOrder?.(order)}
              className="relative mt-1 flex w-full items-center justify-between rounded-md bg-gray-200 px-3 py-3 hover:bg-gray-300"
            >
              <span className="pr-2">{getOrderLabel(order)}</span>
              <ActionMenu
                onEdit={() => handlers.handleEdit(order)}
                onDelete={() => handlers.requestDelete(order.id)}
              />
            </li>
          ))
        ) : (
          <p className="text-gray-500">No matching items</p>
        )}
      </ul>

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
