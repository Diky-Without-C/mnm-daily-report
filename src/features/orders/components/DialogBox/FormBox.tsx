import type { Report } from "@apps/supabase/report.dto";
import { ITEM_TYPES, CONTAINER_TYPES } from "@apps/constants";
import InputText from "@components/Input/InputText";
import SelectField from "@components/DropDown/SelectField";
import Dialog from "@components/Dialog";
import Button from "@components/Button";
import { useLocalStorage } from "@hooks/useLocaleStorage";
import { ORDER_CATEGORY } from "../../order.constants";

interface FormProps {
  open: boolean;
  form: Report | null;
  onClose(): void;
  onChange(name: string, value?: string | number): void;
  onSubmit(): void;
}

export default function FormBox({
  open,
  form,
  onClose,
  onChange,
  onSubmit,
}: FormProps) {
  const [codeHint] = useLocalStorage<string[]>("codeHint", []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  if (!form) return;

  return (
    <Dialog open={open} onClose={onClose} className="max-w-md p-6">
      <form
        onSubmit={handleSubmit}
        className="relative grid w-full grid-cols-4 grid-rows-4 gap-2"
      >
        <InputText
          label="Code"
          value={form.code}
          onChange={(value) => onChange("code", value)}
          hints={codeHint}
          className="col-span-2"
        />

        <SelectField
          label="Category"
          value={form.category}
          onChange={(value) => onChange("category", value)}
          options={Object.values(ORDER_CATEGORY)}
          className="col-span-2 col-start-3"
        />

        <SelectField
          label="From"
          value={form.from}
          onChange={(value) => onChange("from", value)}
          options={CONTAINER_TYPES}
          className="col-span-2 row-start-2"
        />

        <InputText
          label="Number"
          value={form.number === 0 ? "" : form.number.toString()}
          onChange={(value) => onChange("number", value)}
          type="number"
          className="col-span-2 col-start-3 row-start-2"
        />

        <SelectField
          label="Type"
          value={form.type}
          onChange={(value) => onChange("type", value)}
          options={Object.values(ITEM_TYPES)}
          className="col-span-2 row-start-3"
        />

        <InputText
          label="Amount"
          value={form.amount === 0 ? "" : form.amount.toString()}
          onChange={(value) => onChange("amount", value)}
          type="number"
          className="col-span-2 col-start-3 row-start-3"
          unit="PCS"
        />

        <div className="col-span-2 col-start-3 mt-5 flex justify-end gap-2">
          <Button type="button" onClick={onClose} variant="error">
            Cancel
          </Button>
          <Button type="submit" variant="info">
            Submit
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
