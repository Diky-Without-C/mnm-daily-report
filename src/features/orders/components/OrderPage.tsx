import { OrderCategory } from "../order.constants";
import useOrderPage from "../useOrders";
import { getOrderLabel } from "../order.helpers";
import DeleteDialog from "./DeleteDialog";
import SearchBar from "./SearchBar";
import Form from "./Form";

interface OrderPageProps {
  mode: (typeof OrderCategory)[keyof typeof OrderCategory];
}

export default function OrderPage({ mode }: OrderPageProps) {
  const { orders, form, selectedId, deleteTargetId, handlers } = useOrderPage({
    mode,
  });

  return (
    <>
      <SearchBar
        mode={mode}
        onSearch={handlers.handleSearch}
        onAdd={handlers.handleAdd}
      />

      <ul className="mt-2 flex flex-col items-center overflow-y-auto">
        {orders.map((order) => (
          <li
            key={order.id}
            onClick={() => handlers.handleSelect(order.id)}
            className="relative mt-1 flex w-full flex-col gap-2 rounded-md bg-gray-200 py-4 pl-2 hover:bg-gray-300"
          >
            <span>{getOrderLabel(order)}</span>

            {selectedId === order.id && (
              <div className="mx-1 flex justify-between gap-1">
                <button
                  onClick={() => handlers.handleEdit(order)}
                  className="w-1/2 rounded-md bg-blue-500 px-2 py-2 font-semibold text-white hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handlers.requestDelete(order.id)}
                  className="w-1/2 rounded-md bg-red-500 px-2 py-2 font-semibold text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
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
    </>
  );
}
