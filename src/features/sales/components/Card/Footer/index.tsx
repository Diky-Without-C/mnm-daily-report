import Pagination from "@components/Pagination";
import { ITEMS_PER_PAGE } from "@constants/Order";
import type { usePagination } from "@features/sales/hooks/usePagination";

interface FooterProps {
  pagination: ReturnType<typeof usePagination>;
}

export default function Footer({ pagination }: FooterProps) {
  const start = (pagination.page - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(
    start + ITEMS_PER_PAGE - 1,
    pagination.totalPages * ITEMS_PER_PAGE,
  );

  return (
    <div className="flex h-16 w-full items-center justify-between px-2 py-2">
      <div className="flex items-center gap-1">
        <span className="text-center text-gray-700 tabular-nums">
          Show {start}–{end}
        </span>
        <span className="font-medium text-gray-700">
          of {pagination.totalPages * ITEMS_PER_PAGE}
        </span>
      </div>
      <Pagination {...pagination} />
    </div>
  );
}
