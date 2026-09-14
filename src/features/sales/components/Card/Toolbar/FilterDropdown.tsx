import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Button from "@components/Button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@components/Dropdown";
import CheckBox from "@components/Input/CheckBox";
import Divider from "@components/Divider";
import type { SalesFilter } from "@features/sales/sales.type";

interface FilterDropdownProps {
  filter: SalesFilter;
  onFilter: (group: keyof SalesFilter, key: string, value: boolean) => void;
}

export default function FilterDropdown({
  filter,
  onFilter,
}: FilterDropdownProps) {
  return (
    <Dropdown closeOnSelect={false}>
      <DropdownTrigger asChild>
        <Button className="px-3 py-1.5">
          <AdjustmentsHorizontalIcon className="size-5" /> Filter
        </Button>
      </DropdownTrigger>

      <DropdownContent className="max-h-[17rem] w-56 p-1.5">
        {Object.keys(filter).map((group, index) => {
          const groupFilters = filter[group];

          return (
            <div key={group}>
              <div className="px-2 pt-1 pb-1.5">
                <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  {group}
                </span>
              </div>
              <div className="space-y-0.5">
                {Object.keys(groupFilters).map((key) => {
                  const id = `filter-${group}-${key}`;

                  return (
                    <DropdownItem
                      key={key}
                      onClick={() => onFilter(group, key, !groupFilters[key])}
                      className="px-2"
                    >
                      <label
                        htmlFor={id}
                        className="flex w-full cursor-pointer items-center gap-2"
                      >
                        <CheckBox
                          id={id}
                          checked={groupFilters[key]}
                          onChange={(e) =>
                            onFilter(group, key, !e.target.checked)
                          }
                        />
                        <span className="text-sm">{key}</span>
                      </label>
                    </DropdownItem>
                  );
                })}
              </div>
              {index < Object.keys(filter).length - 1 &&
                Object.keys(filter).length > 1 && <Divider className="my-1" />}
            </div>
          );
        })}
      </DropdownContent>
    </Dropdown>
  );
}
