import { useState } from "react";
import { type Report } from "@services/firebase/report.type";

export default function DialogForm() {
  const [form, setForm] = useState<Report>({
    code: "",
    category: "pre order",
    amount: 0,
    type: "",
    from: "MC",
    number: 0,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "number" ? Number(value) : value,
    }));
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="absolute top-1/2 right-1/2 flex w-3/6 translate-x-1/2 -translate-y-1/2 flex-col rounded-lg bg-white p-4 shadow-lg"
    >
      <div>
        <label className="block font-medium">Code</label>
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
      </div>

      <div>
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

      {form.category === "pre order" && (
        <div>
          <label className="block font-medium">Number</label>
          <input
            type="number"
            name="number"
            value={form.number ?? ""}
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
        </div>
      )}

      <div>
        <label className="block font-medium">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block font-medium">Type</label>
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block font-medium">From</label>
        <select
          name="from"
          value={form.from}
          onChange={handleChange}
          className="w-full rounded border p-2"
        >
          <option value="pre order">MC</option>
          <option value="container">LOKAL</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Submit
      </button>
    </form>
  );
}
