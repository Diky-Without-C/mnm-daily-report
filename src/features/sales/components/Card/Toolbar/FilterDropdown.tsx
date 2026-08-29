import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Button from "@components/Button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@components/Dropdown";
import CheckBox from "@components/Input/CheckBox";
import type { SalesFilter } from "@features/sales/sales.type";

interface FilterDropdownProps {
  filter: SalesFilter;
  onFilter: (group: keyof SalesFilter, key: string, value: boolean) => void;
}

export default function FilterDropdown({
  filter: { category },
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
            Category
          </span>
        </div>
        <div className="space-y-0.5">
          {Object.keys(category).map((categoryItem) => {
            const id = `filter-category-${categoryItem}`;

            return (
              <DropdownItem
                key={categoryItem}
                onClick={() =>
                  onFilter("category", categoryItem, !category[categoryItem])
                }
                className="px-2"
              >
                <label
                  htmlFor={id}
                  className="flex w-full cursor-pointer items-center gap-2"
                >
                  <CheckBox
                    id={id}
                    checked={category[categoryItem]}
                    onChange={(e) =>
                      onFilter("category", categoryItem, !e.target.checked)
                    }
                  />
                  <span className="text-sm">{categoryItem}</span>
                </label>
              </DropdownItem>
            );
          })}
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
