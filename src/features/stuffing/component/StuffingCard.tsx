import InputText from "@components/Input/InputText";
import { getOrderLabel } from "@/features/orders/order.helpers";
import type { StuffingForm } from "../useStuffing";

interface StuffingCardProps {
  form: StuffingForm;
  onChange(name: string, value: string | number | boolean): void;
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

        <div className="mt-4 flex items-center">
          <label
            htmlFor="clearOrder"
            className="group flex cursor-pointer items-center gap-3 select-none"
          >
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name="clearOrder"
                id="clearOrder"
                checked={form.clearOrder}
                onChange={(e) => onChange("clearOrder", e.target.checked)}
                className="peer sr-only"
              />

              <div className="pointer-events-none absolute size-10 rounded-full bg-blue-500/20 opacity-0 transition duration-300 peer-active:scale-100 peer-active:opacity-100" />

              <div className="flex size-5 items-center justify-center rounded-[4px] border-2 border-gray-400 bg-white transition-all duration-200 group-hover:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600">
                <svg
                  className={`size-3.5 text-white transition-all duration-150 ${form.clearOrder ? "scale-100 opacity-100" : "scale-0 opacity-0"} `}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <span>Clear order after stuffing</span>
          </label>
        </div>
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
