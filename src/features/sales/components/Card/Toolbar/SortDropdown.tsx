import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import Button from "@components/Button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@components/Dropdown";
import type { SalesSort } from "@features/sales/sales.type";

export const SortOptions = [
  {
    value: "monthly-asc",
    label: "Total: Low → High",
  },
  {
    value: "monthly-desc",
    label: "Total: High → Low",
  },
] as const;

interface SortDropdownProps {
  sort: SalesSort;
  onSort: (sort: SalesSort) => void;
}

export default function SortDropdown({ sort, onSort }: SortDropdownProps) {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button className="px-3 py-1.5">
          <ArrowsUpDownIcon className="size-5" /> Sort
        </Button>
      </DropdownTrigger>

      <DropdownContent className="w-56 p-1.5">
        <div className="px-2 pt-1 pb-1.5">
          <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Sort by
          </span>
        </div>
        <div className="space-y-0.5">
          {SortOptions.map((option) => {
            return (
              <DropdownItem
                key={option.label}
                onClick={() => onSort(option.value)}
                className="px-2"
                selected={option.value === sort}
              >
                <span className="text-sm">{option.label}</span>
              </DropdownItem>
            );
          })}
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
