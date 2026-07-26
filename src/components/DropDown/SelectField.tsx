import { useRef, useEffect, forwardRef } from "react";
import ChevronUp from "@components/Icons/ChevronUp";
import { cn } from "@utils/cn";
import SelectItem from "./SelectItem";
import { useSelect } from "./useSelect";

export interface SelectFieldProps<T extends string = string> {
  label?: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  className?: string;
}

const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  ({ label, value, options, onChange, className = "" }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const { open, toggle, close, activeIndex, setActiveIndex } =
      useSelect(options);

    const handleSelect = (option: string) => {
      onChange(option);
      close();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
          break;

        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
          break;

        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0) {
            handleSelect(options[activeIndex]);
          }
          break;

        case "Escape":
          close();
          break;
      }
    };

    useEffect(() => {
      if (activeIndex >= 0) {
        itemRefs.current[activeIndex]?.scrollIntoView({
          block: "nearest",
        });
      }
    }, [activeIndex]);

    return (
      <div className={cn("mx-auto rounded-lg bg-white py-2", className)}>
        <div
          ref={wrapperRef}
          tabIndex={0}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              close();
            }
          }}
          onKeyDown={handleKeyDown}
          className="relative"
        >
          <button
            ref={ref}
            type="button"
            onClick={toggle}
            className="flex h-10 w-52 items-center justify-between rounded-lg bg-transparent px-4 text-gray-900 ring-2 ring-gray-300 focus:ring-blue-400"
          >
            <span>{value}</span>
            <ChevronUp className={open ? "rotate-180" : ""} />
          </button>
          {label && (
            <span className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600">
              {label}
            </span>
          )}
          {open && (
            <div
              data-ignore-click-outside
              className="absolute left-0 z-10 mt-1 max-h-32 w-52 overflow-auto rounded-md bg-neutral-800 text-white shadow-lg"
            >
              {options.map((option, index) => (
                <SelectItem
                  key={option}
                  option={option}
                  isActive={index === activeIndex}
                  onSelect={handleSelect}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

SelectField.displayName = "SelectField";

export default SelectField;
