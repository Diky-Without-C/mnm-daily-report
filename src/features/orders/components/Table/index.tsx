import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import CheckBox from "@components/Input/CheckBox";
import Badge from "@components/Badge";
import { cn } from "@utils/cn";
import { formatNumber } from "@utils/formatNumber";
import { useSelection } from "../../hooks/useSelection";
import { ITEMS_PER_PAGE } from "../../order.constants";
import Action from "./Action";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface TableProps {
  mode: "order" | "stuffing";
  orders: OrderSchema[];
  selection: ReturnType<typeof useSelection>;
  onEdit: (order: OrderSchema) => void;
  onDelete: (ids: string[]) => void;
}

const FROM_BADGE_VARIANT = {
  LOKAL: "default",
  MC: "info",
  MF: "success",
} as const;

export default function Table({
  mode,
  orders,
  selection,
  onEdit,
  onDelete,
}: TableProps) {
  const emptyRows = Math.max(ITEMS_PER_PAGE - orders.length, 0);

  return (
    <table className="w-full table-fixed border-collapse text-gray-700">
      <thead className="border-b border-gray-200 bg-gray-50">
        <tr className="h-12">
          <th className="w-12 px-4">
            {mode === "order" && (
              <CheckBox
                checked={selection.allSelected}
                onChange={selection.toggleAll}
              />
            )}
          </th>
          <th className="w-[15%] px-4 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Category
          </th>
          <th className="w-[12%] px-4 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
            From
          </th>
          <th className="w-[15%] px-4 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Number
          </th>
          <th className="w-[16%] px-4 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Code
          </th>
          <th className="w-[14%] px-4 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Type
          </th>
          <th className="w-[13%] px-4 text-right text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Amount
          </th>
          <th className="w-14 px-4" />
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {orders.map((order) => {
          const selected = selection.isSelected(order);

          return (
            <tr
              key={order.id}
              className={cn(
                "group relative h-16 transition-colors hover:bg-gray-50",
                selected && "bg-blue-50/60 hover:bg-blue-50",
              )}
              onClick={() => {
                if (mode === "stuffing") {
                  selection.clear();
                }
                selection.toggle(order);
              }}
            >
              <td className="relative px-4">
                {selected && (
                  <span className="absolute inset-y-0 left-0 w-0.5 bg-blue-500" />
                )}
                {mode === "order" && (
                  <CheckBox
                    checked={selected}
                    onChange={() => selection.toggle(order)}
                  />
                )}
                {mode === "stuffing" && (
                  <div>
                    <ChevronLeftIcon className="size-5" />
                  </div>
                )}
              </td>
              <td className="px-4 font-medium text-gray-700 capitalize">
                {order.category}
              </td>
              <td className="px-4">
                <Badge variant={FROM_BADGE_VARIANT[order.from]}>
                  {order.from}
                </Badge>
              </td>
              <td className="px-4 font-medium text-gray-900 tabular-nums">
                {order.number}
              </td>
              <td className="px-4">
                <div
                  className="truncate font-medium text-gray-600"
                  title={order.code}
                >
                  {order.code}
                </div>
              </td>
              <td className="px-4 text-gray-600">{order.type}</td>
              <td className="px-4 text-right font-medium text-gray-900 tabular-nums">
                {formatNumber(order.amount)}
              </td>
              <td className="px-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <Action
                    onEdit={() => onEdit(order)}
                    onDelete={() => onDelete([order.id])}
                  />
                </div>
              </td>
            </tr>
          );
        })}

        {Array.from({ length: emptyRows }).map((_, index) => (
          <tr key={`empty-${index}`} className="h-16">
            <td colSpan={8} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}
