import Button from "@components/Button";
import SearchBar from "@components/SearchBar";
import Add from "@components/Icons/Add";
import type {
  OrderCategoryType,
  OrderFilters,
  OrderSort,
} from "@features/orders/order.type";
import FilterDropdown from "./FilterDropdown";
import SortDropdown from "./SortDropdown";
import { ORDER_CATEGORY } from "@features/orders/order.constants";
import { cn } from "@utils/cn";

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
  const activeIndex = categories.indexOf(mode);

  return (
    <div className="mb-3 flex justify-between">
      <div className="relative inline-grid grid-flow-col rounded-lg bg-gray-100 p-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onModeChange(category)}
            className={cn(
              "relative z-10 rounded-md px-4 py-1.5 text-sm font-medium capitalize",
              "transition-colors duration-200",
              mode === category
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-800",
            )}
          >
            {category}
          </button>
        ))}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-1 left-1 rounded-md bg-white shadow-sm transition-transform duration-200 ease-out"
          style={{
            width: `calc((100% - 0.5rem) / ${categories.length})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>
      <div className="flex gap-1">
        <SearchBar onSearch={onSearch} className="mr-0.5 w-xs" />
        <FilterDropdown filter={filter} onFilter={onFilter} />
        <SortDropdown sort={sort} onSort={onSort} />
        <Button variant="info" className="px-3" onClick={onAdd}>
          <Add />
        </Button>
      </div>
    </div>
  );
}
