import Pagination from "@components/Pagination";
import type { usePagination } from "@features/orders/hooks/usePagination";
import type { useSelection } from "@features/orders/hooks/useSelection";
import SelectionBar from "./SelectionBar";

interface FooterProps {
  selection: ReturnType<typeof useSelection> | null;
  pagination: ReturnType<typeof usePagination>;
  onDeleteSelected: () => void;
}

export default function Footer({
  selection,
  pagination,
  onDeleteSelected,
}: FooterProps) {
  return (
    <div className="flex h-16 w-full items-center justify-between px-2 py-2">
      {selection ? (
        <SelectionBar
          count={selection.selectedCount}
          onClear={selection.clear}
          onDelete={onDeleteSelected}
        />
      ) : (
        <div />
      )}
      <Pagination {...pagination} />
    </div>
  );
}
