import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "@components/Button";
import SearchBar from "@components/SearchBar";
import type {
  OrderCategoryType,
  OrderFilters,
  OrderSort,
} from "@features/orders/order.type";
import FilterDropdown from "./FilterDropdown";
import SortDropdown from "./SortDropdown";
import { ORDER_CATEGORY } from "@features/orders/order.constants";
import Tabs from "@components/Tabs";

interface ToolbarProps {
  mode: OrderCategoryType;
  onModeChange: (mode: OrderCategoryType) => void;
  onSearch: (value: string) => void;
  onAdd: () => void;
  filter: OrderFilters;
  onFilter: (group: keyof OrderFilters, key: string, value: boolean) => void;
  sort: OrderSort;
  onSort: (sort: OrderSort) => void;
}

export default function Toolbar({
  mode,
  onModeChange,
  onSearch,
  onAdd,
  filter,
  onFilter,
  sort,
  onSort,
}: ToolbarProps) {
  const categories = Object.values(ORDER_CATEGORY);

  return (
    <div className="mb-3 flex justify-between">
      <Tabs items={categories} value={mode} onChange={onModeChange} />
      <div className="flex gap-1">
        <SearchBar onSearch={onSearch} className="mr-0.5 w-xs" />
        <FilterDropdown filter={filter} onFilter={onFilter} />
        <SortDropdown sort={sort} onSort={onSort} />
        <Button variant="info" className="px-3" onClick={onAdd}>
          <PlusIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}
