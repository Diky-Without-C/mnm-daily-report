import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "@components/Button";
import SearchBar from "@components/SearchBar";
import type { OrderFilters, OrderSort } from "@features/orders/order.type";
import FilterDropdown from "./FilterDropdown";
import SortDropdown from "./SortDropdown";

interface ToolbarProps {
  onSearch: (value: string) => void;
  onAdd: () => void;
  filter: OrderFilters;
  onFilter: (group: keyof OrderFilters, key: string, value: boolean) => void;
  sort: OrderSort;
  onSort: (sort: OrderSort) => void;
}

export default function Toolbar({
  onSearch,
  onAdd,
  filter,
  onFilter,
  sort,
  onSort,
}: ToolbarProps) {
  return (
    <div className="mb-2 flex">
      <div className="flex w-full gap-1">
        <SearchBar onSearch={onSearch} className="mr-0.5 w-full bg-white" />
        <FilterDropdown filter={filter} onFilter={onFilter} />
        <SortDropdown sort={sort} onSort={onSort} />
        <Button
          variant="info"
          className="px-3 whitespace-nowrap"
          onClick={onAdd}
        >
          <PlusIcon className="size-5" /> Order
        </Button>
      </div>
    </div>
  );
}
