import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@components/Dropdown";
import { CONTAINER_TYPES, type ContainerType } from "@constants/Order";
import { cn } from "@utils/cn";

interface ContainerDropdownProps {
  value: ContainerType | "";
  onChange: (value: ContainerType) => void;
  invalid?: boolean;
}

export default function ContainerDropdown({
  value,
  onChange,
  invalid = false,
}: ContainerDropdownProps) {
  return (
    <Dropdown className="relative w-full">
      <DropdownTrigger className="w-full">
        <div
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md bg-transparent px-4 text-gray-900 ring-1",
            invalid ? "ring-red-500" : "ring-gray-300",
          )}
        >
          <span>{value === "" ? "-" : value}</span>
          <ChevronDownIcon className="size-5 shrink-0" />
        </div>
      </DropdownTrigger>
      <DropdownContent className="right-0 left-0 w-auto p-1.5">
        <div className="space-y-0.5">
          {CONTAINER_TYPES.map((container) => (
            <DropdownItem
              key={container}
              onClick={() => onChange(container)}
              className="px-2"
              selected={container === value}
            >
              <span className="text-sm">{container}</span>
            </DropdownItem>
          ))}
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
