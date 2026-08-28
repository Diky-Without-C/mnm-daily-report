import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import Button from "@components/Button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@components/Dropdown";
import type { OrderSort } from "@features/orders/order.type";

export const SortOptions = [
  {
    value: "number-asc",
    label: "Number: Low → High",
  },
  {
    value: "number-desc",
    label: "Number: High → Low",
  },
  {
    value: "amount-asc",
    label: "Amount: Low → High",
  },
  {
    value: "amount-desc",
    label: "Amount: High → Low",
  },
] as const;

interface SortDropdownProps {
  sort: OrderSort;
  onSort: (sort: OrderSort) => void;
}

export default function SortDropdown({ sort, onSort }: SortDropdownProps) {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button className="px-3 py-1.5">
          <ArrowsUpDownIcon className="size-5" />
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
