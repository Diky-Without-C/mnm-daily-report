import { useEffect, useState } from "react";
import type { Report } from "@services/supabase/report.type";
import { useSupabase } from "@services/supabase/useSupabaseStore";
import formatNumber from "@services/xlsx/utils/formatNumber";
import { itemTypes, containerTypes } from "@constant/constant.json";
import SearchBar from "./searchBar";
import Form from "./form";

interface OrderListProps {
  mode: "pre order" | "container";
}

export default function OrderList({ mode }: OrderListProps) {
  const { remove, create, update, data } = useSupabase<Report>("report");

  const [orders, setOrders] = useState<Report[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Report | null>(null);
  const [search, setSearch] = useState("");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setOrders((data as Report[]).filter((item) => item.category === mode));
  }, [data, mode]);

  const handleSearch = (value: string) => setSearch(value);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "amount" || name === "number"
                ? Number(value) || 0
                : name === "code"
                  ? value.toUpperCase()
                  : value,
          }
        : null,
    );
  };

  const handleCloseForm = () => setForm(null);

  const handleSubmit = async () => {
    if (!form) return;

    const { id, ...formData } = form;

    if (id === "add") await create(formData);
    else await update(id, formData);

    handleCloseForm();
  };

  const requestDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    await remove(deleteId);
    setOrders((prev) => prev.filter((o) => o.id !== deleteId));

    setDeleteId(null);
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowDeleteDialog(false);
  };

  const handleEdit = (order: Report) => setForm(order);

  const handleAdd = () =>
    setForm({
      id: "add",
      code: "",
      category: mode,
      from: containerTypes[0],
      number: 0,
      amount: 0,
      type: Object.values(itemTypes)[0],
    });

  const getLabel = (order: Report) =>
    order.category === "pre order"
      ? `(PO.${order.number}/${order.from}) ${order.code} ${order.type} ${formatNumber(order.amount)}`
      : `(${order.from} ${order.number.toString().padStart(2, "0")}) ${order.code} ${order.type} ${formatNumber(order.amount)}`;

  const filteredOrders = orders
    .sort((a, b) =>
      a.number !== b.number
        ? a.number - b.number
        : a.code.localeCompare(b.code),
    )
    .filter((item) =>
      getLabel(item).toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <>
      <SearchBar mode={mode} onSearch={handleSearch} onAdd={handleAdd} />

      <ul className="mt-2 flex flex-col items-center overflow-y-auto">
        {filteredOrders.map((order) => (
          <li
            key={order.id}
            onClick={() =>
              setSelectedId((prev) => (prev === order.id ? null : order.id))
            }
            className="relative mt-1 flex w-full flex-col gap-2 rounded-md bg-gray-200 py-4 pl-2 hover:bg-gray-300"
          >
          <span>{getLabel(order)}</span>

            {selectedId === order.id && (
              <div
                onClick={() => setSelectedId(null)}
                className="mx-1 flex justify-between gap-1"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(order);
                  }}
                  className="text-md w-1/2 rounded-md bg-blue-500 px-2 py-2 font-semibold text-white hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    requestDelete(order.id);
                  }}
                  className="text-md w-1/2 rounded-md bg-red-500 px-2 py-2 font-semibold text-white hover:bg-red-600"
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
          onClose={handleCloseForm}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      )}

      {showDeleteDialog && (
        <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <section className="rounded-lg bg-white p-4 shadow-lg">
            <p className="text-center text-lg font-semibold">
              Are you sure you want to delete this order?
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="rounded-lg bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </section>
        </main>
      )}
    </>
  );
}
