import { useEffect } from "react";
import type { Report } from "@apps/supabase/report.dto";
import Button from "@components/Button";
import Divider from "@components/Divider";
import CheckBox from "@components/Input/CheckBox";
import InputText from "@components/Input/InputText";
import useStuffing from "@features/stuffing/useStuffing";
import ContainerDropdown from "./ContainerDropdown";

interface CardProps {
  selected: Report | null;
}

export default function Card({ selected }: CardProps) {
  const { form, handler } = useStuffing();

  useEffect(() => {
    if (selected) {
      handler.selectItem(selected);
    }
  }, [handler, selected]);

  return (
    <section className="flex h-full w-full flex-col overflow-hidden">
      <header className="shrink-0 px-3 py-4">
        <h1 className="text-xl font-semibold">Stuffing To Container</h1>
        <p className="mt-1 text-sm text-gray-500">
          Move the selected order into a container.
        </p>
      </header>
      <Divider />
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <div>
              <h2 className="text-sm font-medium">Selected Order</h2>
              <p className="text-xs text-gray-500">
                The order that will be stuffed.
              </p>
            </div>
            <div className="rounded-lg border border-gray-500 bg-gray-50 px-4 py-3">
              {form.item ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {form.item.type} {form.item.code}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                    {form.item.category}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No order selected</p>
              )}
            </div>
          </section>
          <section className="flex flex-col gap-3">
            <div>
              <h2 className="text-sm font-medium">Container</h2>
              <p className="text-xs text-gray-500">
                Enter the destination container.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="containerCategory"
                  className="text-sm text-gray-600"
                >
                  From
                </label>
                <div className="w-full">
                  <ContainerDropdown
                    value={form.containerCategory ?? "MC"}
                    onChange={(value) =>
                      handler.handleChange("containerCategory", value)
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="containerNumber"
                  className="text-sm text-gray-600"
                >
                  Number
                </label>
                <InputText
                  name="containerNumber"
                  id="containerNumber"
                  type="number"
                  value={form.containerNumber}
                  onChange={(e) =>
                    handler.handleChange("containerNumber", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-3">
            <div>
              <h2 className="text-sm font-medium">Quantity</h2>
              <p className="text-xs text-gray-500">
                How many items should be stuffed?
              </p>
            </div>
            <InputText
              name="stuffingQty"
              id="stuffingQty"
              type="number"
              unit="PCS"
              value={form.stuffingQty}
              onChange={(e) =>
                handler.handleChange("stuffingQty", e.target.value)
              }
              className="w-full"
            />
          </section>
          <section className="rounded-lg border border-gray-500 bg-gray-50 px-4 py-3">
            <label
              htmlFor="clearOrder"
              className="flex cursor-pointer items-center gap-3"
            >
              <CheckBox
                id="clearOrder"
                checked={form.clearOrder ?? false}
                onChange={(e) =>
                  handler.handleChange("clearOrder", e.target.checked)
                }
              />
              <div>
                <p className="text-sm font-medium">
                  Clear order after stuffing
                </p>
                <p className="text-xs text-gray-500">
                  Remove the order once the stuffing is completed.
                </p>
              </div>
            </label>
          </section>
        </div>
      </div>
      <Divider className="h-[2px]" />
      <footer className="mt-0.5 shrink-0 px-4 py-3">
        <Button
          variant="info"
          className="w-full justify-center"
          disabled={!form.item}
          type="submit"
          onClick={handler.handleSubmit}
        >
          Stuffing
        </Button>
      </footer>
    </section>
  );
}
