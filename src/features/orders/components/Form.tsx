import { useRef, useState } from "react";
import type { Report } from "@services/supabase/report.type";
import { ITEM_TYPES, CONTAINER_TYPES } from "@/app/constants";
import { OrderCategory } from "../order.constants";

interface FormProps {
  form: Report;
  onClose(): void;
  onChange(name: keyof Report, value: string | number): void;
  onSubmit(): void;
}

interface InputFieldProps {
  name: keyof Report;
  label: string;
  value: string | number;
  onChange(name: keyof Report, value: string | number): void;
  className?: string;
}

interface SelectFieldProps {
  name: keyof Report;
  label: string;
  value: string;
  options: readonly string[];
  onChange(name: keyof Report, value: string): void;
}

export default function Form({ form, onClose, onChange, onSubmit }: FormProps) {
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
          className="uppercase"
        />

        <SelectField
          name="category"
          label="Category"
          value={form.category}
          onChange={onChange}
          options={Object.values(OrderCategory)}
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
          value={form.number}
          onChange={onChange}
        />

        <SelectField
          name="type"
          label="Type"
          value={form.type}
          onChange={onChange}
          options={Object.values(ITEM_TYPES).slice(0, 4)}
        />

        <InputField
          name="amount"
          label="Amount"
          value={form.amount}
          onChange={onChange}
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

function InputField({
  name,
  label,
  value,
  onChange,
  className = "",
}: InputFieldProps) {
  return (
    <div className="col-span-2 mx-auto rounded-lg bg-white py-2">
      <div className="relative bg-inherit">
        <input
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${className} h-10 w-52 rounded-lg bg-transparent px-4 text-gray-900 placeholder-transparent ring-2 ring-gray-300 transition-all focus:border-sky-600 focus:ring-sky-500 focus:outline-none`}
          required
        />
        <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600">
          {label}
        </label>
      </div>
    </div>
  );
}

function SelectField({
  name,
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onChange(name, option);
    setOpen(false);
  };

  const handleToggle = () => setOpen((prev) => !prev);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div className="col-span-2 mx-auto rounded-lg bg-white py-2">
      <div
        ref={wrapperRef}
        tabIndex={0}
        onBlur={handleBlur}
        className="relative bg-inherit"
      >
        <button
          type="button"
          onClick={handleToggle}
          className="flex h-10 w-52 items-center justify-between rounded-lg bg-transparent px-4 text-gray-900 ring-2 ring-gray-300 transition-all focus:ring-sky-500"
        >
          <span>{value}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            className={`size-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>

        <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600">
          {label}
        </label>

        {open && (
          <div className="absolute left-0 z-10 mt-1 w-52 rounded-md bg-white shadow-lg">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
