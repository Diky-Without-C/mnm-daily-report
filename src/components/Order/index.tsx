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
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [form, setForm] = useState<Report | null>(null);
  const [search, setSearch] = useState<string>("");

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
                ? isNaN(+value)
                  ? 0
                  : +value
                : name === "code"
                  ? value.toUpperCase()
                  : value,
          }
        : prev,
    );
  };

  const handleClose = () => setForm(null);

  const handleSubmit = async () => {
    if (!form) return;
    const { id, ...formData } = form;

    if (id === "add") await create(formData);
    else await update(id, formData);

    handleClose();
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    setOrders((prev) => prev.filter((e) => e.id !== id));
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

  const filteredOrders = [...orders]
    .sort((a, b) =>
      a.number !== b.number
        ? a.number - b.number
        : a.code.localeCompare(b.code),
    )
    .filter((item) => getLabel(item).match(new RegExp(search, "gi")));

  return (
    <>
      <SearchBar mode={mode} onSearch={handleSearch} onAdd={handleAdd} />

      <ul className="mt-2 flex flex-col items-center overflow-y-auto">
        {filteredOrders.map((order, i) => (
          <li
            key={order.id}
            onClick={() => setSelectedIndex(i)}
            className="relative mt-1 flex w-full items-center justify-between bg-gray-200 py-4 pl-2 hover:bg-gray-300"
          >
            <span>{getLabel(order)}</span>
            {selectedIndex === i && (
              <div className="absolute right-0 mr-2 flex gap-2">
                <button
                  onClick={() => handleEdit(order)}
                  className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {form && (
        <Form
          form={form}
          onClose={handleClose}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
