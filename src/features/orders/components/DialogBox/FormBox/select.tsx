import { forwardRef } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@components/Dropdown";
import ChevronUp from "@components/Icons/ChevronUp";
import { cn } from "@utils/cn";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  options: { content: string }[];
  className?: string;
  label?: string;
  invalid?: boolean;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
  { value, options, className = "", onChange, onEnter, label, invalid },
  ref,
) {
  return (
    <Dropdown ref={ref} className={cn("relative py-2", className)}>
      <div className="relative w-full bg-white">
        <DropdownTrigger
          className={cn(
            "text-md flex h-10 w-full items-center justify-between rounded-md bg-inherit px-4 ring-2 ring-gray-300 outline-none focus:ring-blue-400",
            invalid && "ring-red-400",
          )}
        >
          <span>{value}</span>
          <ChevronUp />
        </DropdownTrigger>
        {label && (
          <span className="absolute -top-3 left-4 bg-inherit px-1 text-sm text-gray-600">
            {label}
          </span>
        )}
      </div>
      <DropdownContent className="w-full -translate-y-1 overflow-y-auto">
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
