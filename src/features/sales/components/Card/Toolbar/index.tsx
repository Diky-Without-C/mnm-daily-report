import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import SearchBar from "@components/SearchBar";
import Button from "@components/Button";
import type { SalesFilter, SalesSort } from "@features/sales/sales.type";
import FilterDropdown from "./FilterDropdown";
import SortDropdown from "./SortDropdown";

interface ToolbarProps {
  setShowField: (show: boolean) => void;
  onSearch: (value: string) => void;
  filter: SalesFilter;
  onFilter: (group: keyof SalesFilter, key: string, value: boolean) => void;
  sort: SalesSort;
  onSort: (sort: SalesSort) => void;
}

export default function Toolbar({
  setShowField,
  onSearch,
  filter,
  onFilter,
  sort,
  onSort,
}: ToolbarProps) {
  return (
    <div className="z-20 mb-2 flex">
      <div className="flex w-full gap-1">
        <SearchBar
          onSearch={onSearch}
          placeHolder="Search sale"
          className="mr-0.5 w-full bg-white"
        />
        <FilterDropdown filter={filter} onFilter={onFilter} />
        <SortDropdown sort={sort} onSort={onSort} />
        <Button
          className="px-3 whitespace-nowrap"
          onClick={() => setShowField(true)}
        >
          <ArrowUpTrayIcon className="size-5" /> Import Sales
        </Button>
      </div>
    </div>
  );
}
