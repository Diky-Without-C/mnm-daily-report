import type { Report } from "@services/firebase/report.type";
import { itemTypes, containerTypes } from "@constant/constant.json";

interface FormProps {
  form: Report;
  onClose: () => void;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  onSubmit: () => void;
}

interface inputFieldProps {
  name: string;
  label: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: readonly string[];
}

export default function Form({ form, onClose, onChange, onSubmit }: FormProps) {
  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose}></div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="relative grid w-3/6 grid-cols-4 gap-2 rounded-lg bg-white p-4 shadow-lg"
      >
        <InputField
          name="code"
          label="Code"
          value={form.code}
          onChange={onChange}
          className="uppercase"
        />
        <SelectField
          name="category"
          label="Category"
          value={form.category}
          onChange={onChange}
          options={["pre order", "container"]}
        />
        <SelectField
          name="from"
          label="From"
          value={form.from}
          onChange={onChange}
          options={containerTypes}
        />
        <InputField
          name="number"
          label="Number"
          value={form.number}
          onChange={onChange}
        />
        <SelectField
          name="type"
          label="Type"
          value={form.type}
          onChange={onChange}
          options={Object.values(itemTypes)}
        />
        <InputField
          name="amount"
          label="Amount"
          value={form.amount}
          onChange={onChange}
        />

        <div className="col-span-4 flex justify-end gap-2">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

function InputField({
  name,
  label,
  value,
  onChange,
  className = "",
}: inputFieldProps) {
  return (
    <div className="col-span-2">
      <label className="block font-medium">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded border p-2 ${className}`}
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div className="col-span-2">
      <label className="block font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded border p-2"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
