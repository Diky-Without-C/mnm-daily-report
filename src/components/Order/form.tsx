import { useRef, useState, useEffect } from "react";
import type { Report } from "@services/supabase/report.type";
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
  className?: string;
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
          options={Object.values(itemTypes).slice(0, 4)}
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
}: inputFieldProps) {
  return (
    <div className="col-span-2 mx-auto rounded-lg bg-white py-2">
      <div className="relative bg-inherit">
        <input
          type="input"
          name={name}
          value={value}
          onChange={onChange}
          className={`${className} h-10 w-52 rounded-lg bg-transparent px-4 text-gray-900 placeholder-transparent ring-2 ring-gray-300 transition-all focus:border-sky-600 focus:ring-sky-500 focus:outline-none`}
          required
        />
        <label className="absolute -top-3 left-4 cursor-text bg-white px-1 text-sm text-gray-600 transition-all">
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
  onChange,
  options,
  className = "",
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = (selected: string) => {
    const event = {
      target: {
        name,
        value: selected,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(event);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="col-span-2 mx-auto rounded-lg bg-white py-2">
      <div ref={wrapperRef} className="relative bg-inherit">
        <div
          onClick={() => setOpen((prev) => !prev)}
          className={`${className} flex h-10 w-52 items-center justify-between rounded-lg bg-transparent px-4 text-gray-900 ring-2 ring-gray-300 transition-all focus-within:border-sky-600 focus-within:ring-sky-500`}
        >
          <span>{value || "Select option"}</span>

          <button type="button" className="ml-2 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.2}
              stroke="currentColor"
              className={`size-4 ${open && "rotate-180"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>

        <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600">
          {label}
        </label>

        {open && (
          <div className="absolute left-0 z-10 mt-1 w-52 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg">
            <div className="rounded-lg bg-gray-50 py-1 shadow-lg">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        <select name={name} value={value} hidden />
      </div>
    </div>
  );
}
