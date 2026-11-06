import Pagination from "@components/Pagination";
import { ORDER_ITEMS_PER_PAGE } from "@constants/Order";
import SelectionBar from "./SelectionBar";
import type { useCard } from "../useCard";

interface FooterProps {
  selection: ReturnType<typeof useCard>["selection"];
  pagination: ReturnType<typeof useCard>["pagination"];
  deletion: ReturnType<typeof useCard>["deletion"];
}

export default function Footer({
  selection,
  pagination,
  deletion,
}: FooterProps) {
  const start = (pagination.page - 1) * ORDER_ITEMS_PER_PAGE + 1;
  const end = Math.min(
    start + ORDER_ITEMS_PER_PAGE - 1,
    pagination.totalPages * ORDER_ITEMS_PER_PAGE,
  );

  return (
    <div className="flex h-16 w-full items-center justify-between px-2 py-2">
      {selection.enabled ? (
        <SelectionBar selection={selection} deletion={deletion} />
      ) : (
        <div className="flex items-center gap-1">
          <span className="text-center text-gray-700 tabular-nums">
            Show {start}–{end}
          </span>
          <span className="font-medium text-gray-700">
            of {pagination.totalPages * ORDER_ITEMS_PER_PAGE}
          </span>
        </div>
      )}
      <Pagination {...pagination} />
    </div>
  );
}
