import Button from "@components/Button";
import Divider from "@components/Divider";
import InputText from "@components/Input/InputText";
import Autocomplete from "@components/Input/AutocompleteText";
import Modal from "@components/Modal";
import { CONTAINER_TYPES, ORDER_CATEGORIES } from "@constants/Order";
import { ITEM_TYPES } from "@constants/Report";
import { useLocalStorage } from "@hooks/useLocaleStorage";
import type { useOrderForm } from "./useOrderForm";
import Select from "./select";
import Field from "./FormField";

type OrderForm = ReturnType<typeof useOrderForm>;

interface FormProps {
  open: boolean;
  onClose: () => void;
  form: OrderForm["data"];
  error: OrderForm["error"];
  onChange: OrderForm["change"];
  onSubmit: OrderForm["submit"];
}

export default function Form({
  open,
  onClose,
  form,
  error,
  onChange,
  onSubmit,
}: FormProps) {
  const [codeHints] = useLocalStorage("codeHint", []);

  if (!form) return null;
  const getError = (field: string) => error?.fields?.[field];

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex w-full max-w-lg flex-col"
    >
      <header className="shrink-0 px-4 py-4">
        <h1 className="text-xl font-semibold">
          {form.id ? "Edit Order" : "Create Order"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {form.id
            ? "Update the details of the selected order."
            : "Enter the details for the new order."}
        </p>
      </header>
      <Divider />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="min-h-0 flex-1 px-4 py-4">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Code" htmlFor="orderCode" error={getError("code")}>
                <Autocomplete
                  id="orderCode"
                  name="code"
                  options={codeHints}
                  value={form.code ?? ""}
                  onChange={(value) => onChange("code", value)}
                  invalid={!!getError("code")}
                  className="w-full uppercase"
                />
              </Field>
              <Field label="Category" error={getError("category")}>
                <Select
                  value={form.category ?? "-"}
                  onChange={(value) => onChange("category", value)}
                  options={Object.values(ORDER_CATEGORIES)}
                  invalid={!!getError("category")}
                  className="w-full"
                />
              </Field>
              <Field label="From" error={getError("from")}>
                <Select
                  value={form.from ?? "-"}
                  onChange={(value) => onChange("from", value)}
                  options={Object.values(CONTAINER_TYPES)}
                  invalid={!!getError("from")}
                  className="w-full"
                />
              </Field>
              <Field
                label="Number"
                htmlFor="orderNumber"
                error={getError("number")}
              >
                <InputText
                  id="orderNumber"
                  name="number"
                  type="number"
                  value={form.number ?? ""}
                  onChange={(e) =>
                    onChange(
                      "number",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  invalid={!!getError("number")}
                  className="w-full"
                />
              </Field>
              <Field label="Type" error={getError("type")}>
                <Select
                  value={form.type ?? "-"}
                  onChange={(value) => onChange("type", value)}
                  options={Object.values(ITEM_TYPES)}
                  invalid={!!getError("type")}
                  className="w-full"
                />
              </Field>
              <Field
                label="Amount"
                htmlFor="orderAmount"
                error={getError("amount")}
              >
                <InputText
                  id="orderAmount"
                  name="amount"
                  type="number"
                  unit="PCS"
                  value={form.amount ?? ""}
                  onChange={(e) =>
                    onChange(
                      "amount",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  invalid={!!getError("amount")}
                  className="w-full"
                />
              </Field>
            </div>
          </div>
        </div>
        <Divider className="h-[2px]" />
        <footer className="mt-0.5 flex shrink-0 justify-end gap-2 px-4 py-3">
          <Button type="button" onClick={onClose} variant="danger">
            Cancel
          </Button>
          <Button type="submit" variant="info">
            Submit
          </Button>
        </footer>
      </form>
    </Modal>
  );
}
