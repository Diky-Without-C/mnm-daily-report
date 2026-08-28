import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Report } from "@apps/supabase/report.dto";
import Button from "@components/Button";
import CheckBox from "@components/Input/CheckBox";
import { cn } from "@utils/cn";
import { formatNumber } from "@utils/formatNumber";
import { useSelection } from "../../hooks/useSelection";
import { ITEMS_PER_PAGE } from "../../order.constants";

interface TableProps {
  orders: Report[];
  selection: ReturnType<typeof useSelection<Report>>;
  onEdit: (order: Report) => void;
  onDelete: (ids: string[]) => void;
}

export default function Table({
  orders,
  selection,
  onEdit,
  onDelete,
}: TableProps) {
  const emptyRows = Math.max(ITEMS_PER_PAGE - orders.length, 0);

  return (
    <table className="w-full table-fixed border-collapse text-gray-700">
      <thead className="border-b border-gray-200 bg-gray-100">
        <tr>
          <th className="w-1/15 p-4">
            <CheckBox
              checked={selection.allSelected}
              onChange={selection.toggleAll}
            />
          </th>
          <th className="w-2/15 p-4 text-left text-sm">From</th>
          <th className="w-2/15 p-4 text-left text-sm">Number</th>
          <th className="w-4/15 p-4 text-left text-sm">Code</th>
          <th className="w-2/15 p-4 text-left text-sm">Type</th>
          <th className="w-2/15 p-4 text-left text-sm">Amount</th>
          <th className="w-2/15 p-4 text-left text-sm">Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr
            key={order.id}
            className={cn(
              "h-16 even:bg-blue-50",
              selection.isSelected(order) &&
                "bg-gray-50 text-blue-500 shadow-[inset_2px_0_0_currentColor]",
            )}
          >
            <td className="px-4 py-3">
              <CheckBox
                checked={selection.isSelected(order)}
                onChange={() => selection.toggle(order)}
              />
            </td>
            <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-600">
              {order.from}
            </td>
            <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
              {order.number}
            </td>
            <td className="px-4 py-3 text-sm font-medium text-gray-600">
              <div className="truncate" title={order.code}>
                {order.code}
              </div>
            </td>
            <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-600">
              {order.type}
            </td>
            <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
              {formatNumber(order.amount)}
            </td>
            <td className="px-4 py-3 text-sm">
              <div className="flex gap-1">
                <Button
                  className="group relative flex justify-center p-2"
                  onClick={() => onEdit(order)}
                >
                  <span className="pointer-events-none absolute bottom-full mb-2 hidden justify-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium whitespace-nowrap text-white group-hover:flex">
                    Edit
                    <span className="absolute top-full h-2 w-2 -translate-y-1/2 rotate-45 bg-inherit" />
                  </span>
                  <PencilIcon className="size-4" />
                </Button>
                <Button
                  className="group relative flex justify-center p-2"
                  onClick={() => onDelete([order.id])}
                >
                  <span className="pointer-events-none absolute bottom-full mb-2 hidden justify-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium whitespace-nowrap text-white group-hover:flex">
                    Delete
                    <span className="absolute top-full h-2 w-2 -translate-y-1/2 rotate-45 bg-inherit" />
                  </span>
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
        {Array.from({ length: emptyRows }).map((_, index) => (
          <tr key={`empty-${index}`} className="h-16">
            <td colSpan={7} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}
