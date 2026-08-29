import SearchBar from "@components/SearchBar";
import FilterDropdown from "./FilterDropdown";
import SortDropdown from "./SortDropdown";
import type { SalesFilter, SalesSort } from "@features/sales/sales.type";

interface ToolbarProps {
  onSearch: (value: string) => void;
  filter: SalesFilter;
  onFilter: (group: keyof SalesFilter, key: string, value: boolean) => void;
  sort: SalesSort;
  onSort: (sort: SalesSort) => void;
}

export default function Toolbar({
  onSearch,
  filter,
  onFilter,
  sort,
  onSort,
}: ToolbarProps) {
  return (
    <div className="z-20 mb-3 flex justify-end">
      <div className="flex gap-1">
        <SearchBar onSearch={onSearch} className="mr-0.5 w-xs" />
        <FilterDropdown filter={filter} onFilter={onFilter} />
        <SortDropdown sort={sort} onSort={onSort} />
      </div>
    </div>
  );
}
