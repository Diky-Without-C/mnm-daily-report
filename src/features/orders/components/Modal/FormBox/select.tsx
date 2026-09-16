import { forwardRef } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@components/Dropdown";
import { cn } from "@utils/cn";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  options: { content: string }[];
  className?: string;
  invalid?: boolean;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
  { value, options, className, onChange, onEnter, invalid },
  ref,
) {
  return (
    <Dropdown ref={ref} className={cn("relative", className)}>
      <DropdownTrigger className="group w-full">
        <div
          className={cn(
            "text-md flex h-10 w-full items-center justify-between rounded-md bg-inherit px-4 ring-1 outline-none group-focus:ring-blue-400",
            invalid ? "ring-red-400" : "ring-gray-300",
          )}
        >
          <span>{value}</span>
          <ChevronDownIcon className="size-5" />
        </div>
      </DropdownTrigger>
      <DropdownContent className="max-h-52 w-full overflow-y-auto">
        {options.map((option) => (
          <DropdownItem
            key={option.content}
            selected={value === option.content}
            onClick={() => {
              onChange(option.content);
              onEnter?.();
            }}
          >
            {option.content}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
});

export default Select;
