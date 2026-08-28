import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Button from "@components/Button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@components/Dropdown";
import CheckBox from "@components/Input/CheckBox";
import type { OrderFilters } from "@features/orders/order.type";

interface FilterDropdownProps {
  filter: OrderFilters;
  onFilter: (group: keyof OrderFilters, key: string, value: boolean) => void;
}

export default function FilterDropdown({
  filter: { from, type },
  onFilter,
}: FilterDropdownProps) {
  return (
    <Dropdown closeOnSelect={false}>
      <DropdownTrigger asChild>
        <Button className="px-3 py-1.5">
          <AdjustmentsHorizontalIcon className="size-5" />
        </Button>
      </DropdownTrigger>

      <DropdownContent className="w-56 p-1.5">
        <div className="px-2 pt-1 pb-1.5">
          <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            From
          </span>
        </div>
        <div className="space-y-0.5">
          {Object.keys(from).map((container) => {
            const id = `filter-container-${container}`;

            return (
              <DropdownItem
                key={container}
                onClick={() => onFilter("from", container, !from[container])}
                className="px-2"
              >
                <label
                  htmlFor={id}
                  className="flex w-full cursor-pointer items-center gap-2"
                >
                  <CheckBox
                    id={id}
                    checked={from[container]}
                    onChange={(e) =>
                      onFilter("from", container, !e.target.checked)
                    }
                  />
                  <span className="text-sm">{container}</span>
                </label>
              </DropdownItem>
            );
          })}
        </div>
        <div className="my-1.5 border-t border-gray-200" />
        <div className="px-2 pt-1 pb-1.5">
          <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Type
          </span>
        </div>
        <div className="space-y-0.5">
          {Object.keys(type).map((ItemType) => {
            const id = `filter-type-${ItemType}`;

            return (
              <DropdownItem
                key={ItemType}
                onClick={() => onFilter("type", ItemType, !type[ItemType])}
                className="px-2"
              >
                <label
                  htmlFor={id}
                  className="flex w-full cursor-pointer items-center gap-2"
                >
                  <CheckBox
                    id={id}
                    checked={type[ItemType]}
                    onChange={(e) =>
                      onFilter("type", ItemType, !e.target.checked)
                    }
                  />
                  <span className="text-sm">{ItemType}</span>
                </label>
              </DropdownItem>
            );
          })}
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
