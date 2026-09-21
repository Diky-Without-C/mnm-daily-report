import { PencilIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import Badge from "@components/Badge";
import CheckBox from "@components/Input/CheckBox";
import { cn } from "@utils/cn";
import { formatNumber } from "@utils/formatNumber";
import { ITEMS_PER_PAGE } from "../../order.constants";
import type { useCard } from "../Card/useCard";
import Action from "./Action";

interface TableProps {
  orders: OrderSchema[];
  selection: ReturnType<typeof useCard>["selection"];
  form: ReturnType<typeof useCard>["form"];
  deletion: ReturnType<typeof useCard>["deletion"];
  onSelect?: (order: OrderSchema) => void;
}

const FROM_BADGE_VARIANT = {
  LOKAL: "default",
  MC: "info",
  MF: "success",
} as const;

export default function Table({
  orders,
  selection,
  form,
  deletion,
  onSelect,
}: TableProps) {
  const emptyRows = Math.max(ITEMS_PER_PAGE - orders.length, 0);
  const totalColumns = selection.enabled ? 8 : 7;

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-gray-700">
        <thead className="relative border-b border-gray-200 bg-gray-50">
          <tr className="h-12 text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {selection.enabled && (
              <th className="w-[5%] px-4 text-center">
                <CheckBox
                  checked={selection.allSelected}
                  onChange={selection.toggleAll}
                />
              </th>
            )}
            <th className="w-[15%] px-4 text-left">Category</th>
            <th className="w-[10%] px-4 text-left">From</th>
            <th className="w-[15%] px-4 text-left">Number</th>
            <th className="w-[20%] px-4 text-left">Code</th>
            <th className="w-[10%] px-4 text-left">Type</th>
            <th className="w-[15%] px-4 text-right">Amount</th>
            <th className="w-[10%] px-2 text-center" />
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => {
            const selected = selection.isSelected(order);
            const badgeVariant =
              FROM_BADGE_VARIANT[
                order.from as keyof typeof FROM_BADGE_VARIANT
              ] ?? "default";

            return (
              <tr
                key={order.id}
                className={cn(
                  "group relative h-16 cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-50",
                  selected && "bg-blue-50/60 hover:bg-blue-50",
                )}
                onClick={() =>
                  selection.enabled
                    ? selection.toggle(order)
                    : onSelect?.(order)
                }
              >
                {selection.enabled && (
                  <td
                    className="relative px-4 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className={cn(
                        "absolute inset-y-0 left-0 w-0.5 bg-blue-500 transition-all duration-200 ease-in-out",
                        selected
                          ? "scale-y-100 opacity-100"
                          : "scale-y-0 opacity-0",
                      )}
                    />
                    <CheckBox
                      checked={selected}
                      onChange={() => selection.toggle(order)}
                    />
                  </td>
                )}
                <td className="px-4 font-medium whitespace-nowrap text-gray-700 capitalize">
                  {order.category}
                </td>
                <td className="px-4 whitespace-nowrap">
                  <Badge variant={badgeVariant}>{order.from}</Badge>
                </td>
                <td className="px-4 font-medium whitespace-nowrap text-gray-900 tabular-nums">
                  {order.number}
                </td>
                <td className="max-w-xs px-4">
                  <div
                    className="truncate font-medium text-gray-600"
                    title={order.code}
                  >
                    {order.code}
                  </div>
                </td>
                <td className="px-4 whitespace-nowrap text-gray-600">
                  {order.type}
                </td>
                <td className="px-4 text-right font-medium whitespace-nowrap text-gray-900 tabular-nums">
                  {formatNumber(order.amount)}
                </td>
                <td
                  className="w-16 px-2 whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-center">
                    <Action
                      items={[
                        {
                          label: "Edit",
                          icon: <PencilIcon className="size-4" />,
                          onClick: () => form.edit(order),
                        },
                        {
                          label: "Select",
                          icon: <CheckIcon className="size-4" />,
                          onClick: () => {
                            selection.enable();
                            selection.toggle(order);
                          },
                        },
                        {
                          label: "Delete",
                          icon: <TrashIcon className="size-4" />,
                          onClick: () => deletion.request([order.id]),
                          disabled: selection.enabled,
                          variant: "danger",
                        },
                      ]}
                    />
                  </div>
                </td>
              </tr>
            );
          })}

          {orders.length > 0 &&
            Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`} className="h-16">
                <td colSpan={totalColumns} />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
