import type { Report } from "@apps/supabase/report.dto";
import SelectionBar from "./SelectionBar";
import Pagination from "./Pagination";
import type { useSelection } from "../../../hooks/useSelection";
import type { usePagination } from "../../../hooks/usePagination";

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
    <div className="flex h-16 w-full items-center justify-between border-t-2 border-gray-200 px-4 py-2">
      <SelectionBar
        count={selection.selectedCount}
        onClear={selection.clear}
        onDelete={onDeleteSelected}
      />
      <Pagination pagination={pagination} />
    </div>
  );
}
