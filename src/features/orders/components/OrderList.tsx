import { useState } from "react";
import type { Report } from "@apps/supabase/report.dto";
import Kebab from "@components/Icons/Kebab";
import Add from "@components/Icons/Add";
import SearchBar from "@components/SearchBar";
import Button from "@components/Buttons";
import { useClickOutside } from "@/hooks/useClickOutside";
import useOrderList from "../useOrders";
import { getOrderLabel } from "../order.helpers";
import type { OrderCategoryType } from "../order.type";
import DeleteDialog from "./DeleteDialog";
import Form from "./Form";

interface OrderPageProps {
  mode: OrderCategoryType;
  setSelectedOrder?(order: Report): void;
}

export default function OrderList({ mode, setSelectedOrder }: OrderPageProps) {
  const { orders, form, deleteTargetId, handlers } = useOrderList({ mode });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold capitalize">{mode}</h1>

        <Button variant="info" onClick={handlers.handleAdd} className="p-2">
          <Add />
        </Button>
      </div>
      <div className="flex w-full gap-1">
        <SearchBar onSearch={handlers.handleSearch} />
      </div>
      <ul className="mt-2 flex h-full flex-col items-center overflow-y-auto">
        {orders.length ? (
          orders.map((order, i) => (
            <li
              key={order.id}
              onClick={() => setSelectedOrder?.(order)}
              className="relative mt-1 flex w-full items-center justify-between rounded-md bg-gray-200 px-3 py-3 hover:bg-gray-300"
            >
              <span className="pr-2">{getOrderLabel(order)}</span>
              <OrderActionMenu
                onEdit={() => handlers.handleEdit(order)}
                onDelete={() => handlers.requestDelete(order.id)}
                position={i === orders.length - 1 && i > 0 ? "Bottom" : "Top"}
              />
            </li>
          ))
        ) : (
          <p className="text-gray-500">No matching items</p>
        )}
      </ul>

      {(form || Boolean(deleteTargetId)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {form ? (
            <Form
              form={form}
              onClose={handlers.closeForm}
              onChange={handlers.handleChange}
              onSubmit={handlers.handleSubmit}
            />
          ) : (
            <DeleteDialog
              onConfirm={handlers.confirmDelete}
              onCancel={handlers.cancelDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface OrderActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  position: "Top" | "Bottom";
}

function OrderActionMenu({ onEdit, onDelete, position }: OrderActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref } = useClickOutside<HTMLDivElement>({
    enabled: isOpen,
    closeOnScroll: true,
    onClickOutside: () => setIsOpen(false),
  });

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((v) => !v);
        }}
        className="cursor-pointer rounded-md p-1 text-gray-600 hover:bg-gray-300"
      >
        <Kebab />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`${position === "Top" ? "top-0" : "bottom-0"} absolute right-0 z-10 w-28 overflow-hidden rounded-md bg-gray-50 shadow-lg`}
        >
          <button
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
