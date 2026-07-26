import { useEffect } from "react";
import type { Report } from "@apps/supabase/report.dto";
import { ITEM_TYPES, CONTAINER_TYPES } from "@apps/constants";
import InputText from "@components/Input/InputText";
import SelectField from "@components/DropDown/SelectField";
import { useLocalStorage } from "@hooks/useLocaleStorage";
import { useDarkOverlay } from "@hooks/useDarkOverlay";
import { useClickOutside } from "@hooks/useClickOutside";
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

  const { ref } = useClickOutside<HTMLFormElement>({
    onClickOutside: () => {
      hideOverlay();
      onClose();
    },
    ignoreSelector: "[data-ignore-click-outside]",
  });

  useEffect(() => {
    showOverlay();
  }, [showOverlay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
    hideOverlay();
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className="relative grid grid-cols-4 gap-2 rounded-lg bg-white p-5 shadow-lg"
    >
      <InputText
        label="Code"
        value={form.code}
        onChange={(value) => onChange("code", value)}
        hints={codeHint}
        className="col-span-2 w-52"
      />

      <SelectField
        label="Category"
        value={form.category}
        onChange={(value) => onChange("category", value)}
        options={Object.values(ORDER_CATEGORY)}
        className="col-span-2"
      />

      <SelectField
        label="From"
        value={form.from}
        onChange={(value) => onChange("from", value)}
        options={CONTAINER_TYPES}
        className="col-span-2"
      />

      <InputText
        label="Number"
        value={form.number === 0 ? "" : form.number.toString()}
        onChange={(value) => onChange("number", value)}
        type="number"
        className="col-span-2 w-52"
      />

      <SelectField
        label="Type"
        value={form.type}
        onChange={(value) => onChange("type", value)}
        options={Object.values(ITEM_TYPES)}
        className="col-span-2"
      />

      <InputText
        label="Amount"
        value={form.amount === 0 ? "" : form.amount.toString()}
        onChange={(value) => onChange("amount", value)}
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
          onClick={() => {
            hideOverlay();
            onClose();
          }}
          className="rounded-lg bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
