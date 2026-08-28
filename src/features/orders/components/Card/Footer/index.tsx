import type { Report } from "@apps/supabase/report.dto";
import Pagination from "@components/Pagination";
import type { usePagination } from "@features/orders/hooks/usePagination";
import type { useSelection } from "@features/orders/hooks/useSelection";
import SelectionBar from "./SelectionBar";

interface FooterProps {
  selection: ReturnType<typeof useSelection<Report>>;
  pagination: ReturnType<typeof usePagination>;
  onDeleteSelected: () => void;
}

export default function Footer({
  selection,
  pagination,
  onDeleteSelected,
}: FooterProps) {
  return (
    <div className="flex h-16 w-full items-center justify-between border-t-2 border-gray-200 px-2 py-2">
      <SelectionBar
        count={selection.selectedCount}
        onClear={selection.clear}
        onDelete={onDeleteSelected}
      />
      <Pagination {...pagination} />
    </div>
  );
}
