import { useRef, useEffect, useState } from "react";
import type { Report } from "@apps/supabase/report.dto";
import { ITEM_TYPES, CONTAINER_TYPES } from "@apps/constants";
import Modal from "@components/Modal";
import Button from "@components/Button";
import { useLocalStorage } from "@hooks/useLocaleStorage";
import { ORDER_CATEGORY } from "../../../order.constants";
import Select from "./select";
import Input from "./input";

interface FormProps {
  open: boolean;
  form: Report | null;
  onClose: () => void;
  onChange: (name: string, value: string | number) => void;
  onSubmit: () => void;
}

export default function FormBox({
  open,
  form,
  onClose,
  onChange,
  onSubmit,
}: FormProps) {
  const [isSubmited, setIsSubmited] = useState(false);
  const [codeHint] = useLocalStorage<string[]>("codeHint", []);

  const codeRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    if (!form) return false;

    return (
      form.code.trim() !== "" &&
      Object.values(ORDER_CATEGORY).includes(form.category) &&
      CONTAINER_TYPES.includes(form.from) &&
      form.number > 0 &&
      Object.values(ITEM_TYPES).includes(form.type) &&
      form.amount > 0
    );
  };

  useEffect(() => {
    if (open) {
      codeRef.current?.focus();
      setIsSubmited(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmited(true);
    if (!validate()) return;
    onSubmit();
  };

  if (!form) return;

  return (
    <Modal open={open} onClose={onClose} className="max-w-md p-6">
      <form
        onSubmit={handleSubmit}
        className="relative grid w-full grid-cols-4 grid-rows-4 gap-2"
      >
        <Input
          ref={codeRef}
          label="Code"
          value={form.code}
          onChange={(value) => onChange("code", value)}
          onEnter={() => categoryRef.current?.focus()}
          hints={codeHint}
          className="col-span-2"
          invalid={isSubmited && form.code === ""}
        />

        <Select
          ref={categoryRef}
          label="Category"
          value={form.category}
          onChange={(value) => onChange("category", value)}
          onEnter={() => fromRef.current?.focus()}
          options={Object.values(ORDER_CATEGORY).map((content) => ({
            content,
          }))}
          className="col-span-2 col-start-3"
          invalid={
            isSubmited && !Object.values(ORDER_CATEGORY).includes(form.category)
          }
        />

        <Select
          ref={fromRef}
          label="From"
          value={form.from}
          onChange={(value) => onChange("from", value)}
          onEnter={() => numberRef.current?.focus()}
          options={CONTAINER_TYPES.map((content) => ({ content }))}
          className="col-span-2 row-start-2"
          invalid={isSubmited && !CONTAINER_TYPES.includes(form.from)}
        />

        <Input
          ref={numberRef}
          label="Number"
          value={form.number === 0 ? "" : form.number.toString()}
          onChange={(value) => onChange("number", value)}
          onEnter={() => typeRef.current?.focus()}
          type="number"
          className="col-span-2 col-start-3 row-start-2"
          invalid={isSubmited && form.number <= 0}
        />

        <Select
          ref={typeRef}
          label="Type"
          value={form.type}
          onChange={(value) => onChange("type", value)}
          onEnter={() => amountRef.current?.focus()}
          options={Object.values(ITEM_TYPES).map((content) => ({ content }))}
          className="col-span-2 row-start-3"
          invalid={isSubmited && !Object.values(ITEM_TYPES).includes(form.type)}
        />

        <Input
          ref={amountRef}
          label="Amount"
          value={form.amount === 0 ? "" : form.amount.toString()}
          onChange={(value) => onChange("amount", value)}
          onEnter={() => {
            setIsSubmited(true);
            if (validate()) {
              onSubmit();
            }
          }}
          type="number"
          className="col-span-2 col-start-3 row-start-3"
          unit="PCS"
          invalid={isSubmited && form.amount <= 0}
        />

        <div className="col-span-2 col-start-3 mt-5 flex justify-end gap-2">
          <Button type="button" onClick={onClose} variant="danger">
            Cancel
          </Button>
          <Button type="submit" variant="info">
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
