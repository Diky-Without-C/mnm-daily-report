import type { Report } from "@services/firebase/report.type";
import { useFirestoreCrud } from "@services/firebase/useFirebaseStore";
import formatNumber from "@services/xlsx/utils/formatNumber";
import { itemTypes } from "@constant/constant.json";
import { useEffect, useState } from "react";

interface OrderListProps {
  mode: "pre order" | "container";
}

export default function OrderList({ mode }: OrderListProps) {
  const { remove, create, update, data } = useFirestoreCrud("report");
  const [orders, setOrders] = useState<Report[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [form, setForm] = useState<Report | null>(null);

  useEffect(() => {
    setOrders((data as Report[]).filter((item) => item.category === mode));
  }, [data, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm(
      (prev) =>
        prev && {
          ...prev,
          [name]:
            name === "amount" || name === "number"
              ? isNaN(+value)
                ? 0
                : +value
              : name === "code"
                ? value.toUpperCase()
                : value,
        },
    );
  };

  const handleClose = () => setForm(null);

  const handleSubmit = async () => {
    if (!form) return;
    const { id, ...formData } = form;

    if (id === "add") {
      await create(formData);
    } else {
      await update(id, formData);
    }

    handleClose();
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    setOrders((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEdit = (order: Report) => {
    setForm(order);
  };

  const handleAdd = () => {
    setForm({
      id: "add",
      code: "",
      category: mode,
      from: "MC",
      number: 0,
      amount: 0,
      type: Object.values(itemTypes)[0],
    });
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold capitalize">{mode}</h1>
        <button
          className="mt-2 mb-2 rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500"
          onClick={handleAdd}
        >
          + Tambah
        </button>
      </div>

      <ul className="flex h-full w-full flex-col items-center overflow-x-hidden overflow-y-auto">
        {[...orders]
          .sort((a, b) => a.number - b.number)
          .map((order, i) => {
            const label =
              order.category === "pre order"
                ? `(PO.${order.number}/${order.from}) ${order.code} ${order.type} ${formatNumber(order.amount)}`
                : `(${order.from} ${order.number > 9 ? order.number : `0${order.number}`}) ${order.code} ${order.type} ${formatNumber(order.amount)}`;

            return (
              <li
                key={order.id}
                onClick={() => setSelectedIndex(i)}
                className={`relative mt-1 flex w-full items-center justify-between bg-gray-200 py-4 pl-2 hover:bg-gray-300`}
              >
                <span>{label}</span>
                {selectedIndex === i && (
                  <div className="absolute right-0 mr-2 flex h-full items-center gap-2">
                    <span
                      onClick={() => handleEdit(order)}
                      className="flex cursor-pointer items-center rounded-lg bg-blue-500 p-2 text-white opacity-85 select-none hover:bg-blue-600"
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
                    </span>
                    <span
                      onClick={() => handleDelete(order.id)}
                      className="flex cursor-pointer items-center rounded-lg bg-blue-500 p-2 text-white opacity-85 select-none hover:bg-blue-600"
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
                    </span>
                  </div>
                )}
              </li>
            );
          })}
      </ul>

      {form && (
        <main className="fixed top-0 right-0 z-50 flex h-screen w-screen items-center justify-center">
          <div
            className="absolute h-full w-full bg-black/20"
            onClick={handleClose}
          ></div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="absolute top-1/2 right-1/2 grid w-3/6 translate-x-1/2 -translate-y-1/2 grid-cols-4 grid-rows-4 gap-2 rounded-lg bg-white p-4 shadow-lg"
          >
            <div className="col-span-2">
              <label className="block font-medium">Code</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                className="w-full rounded border p-2 uppercase"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-medium">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded border p-2"
              >
                <option value="pre order">Pre Order</option>
                <option value="container">Container</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block font-medium">From</label>
              <select
                name="from"
                value={form.from}
                onChange={handleChange}
                className="w-full rounded border p-2"
              >
                <option value="MC">MC</option>
                <option value="LOKAL">LOKAL</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block font-medium">Number</label>
              <input
                type="text"
                name="number"
                inputMode="numeric"
                value={form.number}
                onChange={handleChange}
                className="w-full rounded border p-2"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-medium">Type</label>
              <select
                name="type"
                value={form.type || Object.values(itemTypes)[0]}
                onChange={handleChange}
                className="w-full rounded border p-2"
              >
                {Object.values(itemTypes).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block font-medium">Amount</label>
              <input
                type="text"
                name="amount"
                inputMode="numeric"
                value={form.amount}
                onChange={handleChange}
                className="w-full rounded border p-2"
              />
            </div>

            <div className="col-start-4 col-end-5 row-start-4 row-end-5 flex items-center justify-end gap-2">
              <button
                type="submit"
                className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="cursor-pointer rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </main>
      )}
    </>
  );
}
