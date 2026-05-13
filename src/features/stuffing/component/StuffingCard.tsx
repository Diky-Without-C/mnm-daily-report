import InputText from "@components/Input/InputText";
import { getOrderLabel } from "@/features/orders/order.helpers";
import type { StuffingForm } from "../useStuffing";

interface StuffingCardProps {
  form: StuffingForm;
  onChange(name: string, value: string | number): void;
  onSubmit(): void;
}

export default function StuffingCard({
  form,
  onChange,
  onSubmit,
}: StuffingCardProps) {
  const selectedOrder = form.item;

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div>
        <h1 className="mt-2 text-xl font-semibold">Stuffing to Container</h1>

        <h2 className="mt-7">Selected item</h2>

        <div className="relative mt-3 flex min-h-16 w-full rounded-md bg-blue-100 px-4 py-4">
          {selectedOrder ? getOrderLabel(selectedOrder) : "No item selected"}
        </div>

        <h2 className="mt-4">Container number</h2>

        <InputText
          name="containerNumber"
          type="number"
          value={form.containerNumber}
          onChange={onChange}
          className="w-full"
        />

        <h2 className="mt-4">Quantity to stuff</h2>

        <InputText
          name="stuffingQty"
          type="number"
          unit="PCS"
          value={form.stuffingQty}
          onChange={onChange}
          className="w-full"
        />
      </div>

      <button
        onClick={onSubmit}
        className="cursor-pointer rounded-lg bg-blue-500 py-3 text-lg text-white transition hover:bg-blue-600"
      >
        Stuffing →
      </button>
    </div>
  );
}
