import type { Report } from "@/app/supabase/report.dto";
import { ITEM_TYPES, CONTAINER_TYPES } from "@/app/constants";
import { useLocalStorage } from "@/hooks/useLocaleStorage";
import { ORDER_CATEGORY } from "../../order.constants";
import InputField from "./InputField";
import SelectField from "./SelectField";

interface FormProps {
  form: Report;
  onClose(): void;
  onChange(name: keyof Report, value: string | number): void;
  onSubmit(): void;
}

export default function Form({ form, onClose, onChange, onSubmit }: FormProps) {
  const [codeHint] = useLocalStorage<string[]>("codeHint", []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative grid grid-cols-4 gap-2 rounded-lg bg-white p-5 shadow-lg"
      >
        <InputField
          name="code"
          label="Code"
          value={form.code}
          onChange={onChange}
          hints={codeHint}
          className="uppercase"
        />

        <SelectField
          name="category"
          label="Category"
          value={form.category}
          onChange={onChange}
          options={Object.values(ORDER_CATEGORY)}
        />

        <SelectField
          name="from"
          label="From"
          value={form.from}
          onChange={onChange}
          options={CONTAINER_TYPES}
        />

        <InputField
          name="number"
          label="Number"
          value={form.number === 0 ? "" : form.number}
          onChange={onChange}
          type="number"
        />

        <SelectField
          name="type"
          label="Type"
          value={form.type}
          onChange={onChange}
          options={Object.values(ITEM_TYPES)}
        />

        <InputField
          name="amount"
          label="Amount"
          value={form.amount === 0 ? "" : form.amount}
          onChange={onChange}
          type="number"
        />

        <div className="col-span-4 mt-5 flex justify-end gap-2">
          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Submit
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
