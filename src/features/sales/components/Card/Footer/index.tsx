import Pagination from "@components/Pagination";
import type { usePagination } from "@features/sales/hooks/usePagination";

interface FooterProps {
  pagination: ReturnType<typeof usePagination>;
}

export default function Footer({ pagination }: FooterProps) {
  return (
    <div className="flex h-16 w-full items-center justify-between px-2 py-2">
      <div />
      <Pagination {...pagination} />
    </div>
  );
}
