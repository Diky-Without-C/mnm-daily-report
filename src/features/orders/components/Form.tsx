import { useEffect, useRef } from "react";
import type { Report } from "@/app/supabase/report.dto";
import { ITEM_TYPES, CONTAINER_TYPES } from "@/app/constants";
import { useLocalStorage } from "@/hooks/useLocaleStorage";
import { useDarkOverlay } from "@/hooks/useDarkOverlay";
import InputText from "@components/Input/InputText";
import SelectField from "@components/DropDown/SelectField";
import { ORDER_CATEGORY } from "../order.constants";

interface FormProps {
  form: Report;
  onClose(): void;
  onChange(name: string, value?: string | number): void;
  onSubmit(): void;
}

export default function Form({ form, onClose, onChange, onSubmit }: FormProps) {
  const [codeHint] = useLocalStorage<string[]>("codeHint", []);
  const { showOverlay, hideOverlay } = useDarkOverlay();

  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    showOverlay();

    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
        hideOverlay();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      hideOverlay();
    };
  }, [onClose, showOverlay, hideOverlay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className="relative grid grid-cols-4 gap-2 rounded-lg bg-white p-5 shadow-lg"
    >
      <InputText
        name="code"
        label="Code"
        value={form.code}
        onChange={onChange}
        hints={codeHint}
        className="col-span-2 w-52"
      />

      <SelectField
        name="category"
        label="Category"
        value={form.category}
        onChange={onChange}
        options={Object.values(ORDER_CATEGORY)}
        className="col-span-2"
      />

      <SelectField
        name="from"
        label="From"
        value={form.from}
        onChange={onChange}
        options={CONTAINER_TYPES}
        className="col-span-2"
      />

      <InputText
        name="number"
        label="Number"
        value={form.number === 0 ? "" : form.number.toString()}
        onChange={onChange}
        type="number"
        className="col-span-2 w-52"
      />

      <SelectField
        name="type"
        label="Type"
        value={form.type}
        onChange={onChange}
        options={Object.values(ITEM_TYPES)}
        className="col-span-2"
      />

      <InputText
        name="amount"
        label="Amount"
        value={form.amount === 0 ? "" : form.amount.toString()}
        onChange={onChange}
        type="number"
        className="col-span-2 w-52"
        unit="PCS"
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
  );
}
