import { useEffect, useRef, useState } from "react";
import Kebab from "@components/icon/Kebab";
import Add from "@components/icon/Add";
import useOrderPage from "../useOrders";
import { getOrderLabel } from "../order.helpers";
import type { OrderCategoryType } from "../order.type";
import DeleteDialog from "./DeleteDialog";
import SearchBar from "./SearchBar";
import Form from "./Form";

interface OrderPageProps {
  mode: OrderCategoryType;
}

export default function OrderPage({ mode }: OrderPageProps) {
  const { orders, form, deleteTargetId, handlers } = useOrderPage({
    mode,
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold capitalize">{mode}</h1>

        <button
          type="button"
          onClick={handlers.handleAdd}
          className="rounded-lg bg-blue-400 p-2 text-white hover:bg-blue-500"
        >
          <Add />
        </button>
      </div>

      <SearchBar onSearch={handlers.handleSearch} />

      <ul className="mt-2 flex h-full flex-col items-center overflow-y-auto">
        {orders.length ? (
          orders.map((order) => (
            <li
              key={order.id}
              className="relative mt-1 flex w-full items-start justify-between rounded-md bg-gray-200 px-3 py-3 hover:bg-gray-300"
            >
              <span className="pr-2">{getOrderLabel(order)}</span>

              <OrderActionMenu
                onEdit={() => handlers.handleEdit(order)}
                onDelete={() => handlers.requestDelete(order.id)}
              />
            </li>
          ))
        ) : (
          <p className="text-gray-500">No matching items</p>
        )}
      </ul>

      {form && (
        <Form
          form={form}
          onClose={handlers.closeForm}
          onChange={handlers.handleChange}
          onSubmit={handlers.handleSubmit}
        />
      )}

      <DeleteDialog
        open={Boolean(deleteTargetId)}
        onConfirm={handlers.confirmDelete}
        onCancel={handlers.cancelDelete}
      />
    </div>
  );
}

function OrderActionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleScroll() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="cursor-pointer rounded-md p-1 text-gray-600 hover:bg-gray-300"
      >
        <Kebab />
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 z-10 w-28 overflow-hidden rounded-md bg-gray-50 shadow-lg"
        >
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setOpen(false);
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
