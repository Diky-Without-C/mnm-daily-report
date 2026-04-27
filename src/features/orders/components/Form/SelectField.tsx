import { useRef, useEffect, forwardRef } from "react";
import type { Report } from "@/app/supabase/report.dto";
import ChevronUp from "@components/icon/ChevronUp";
import { useSelect } from "./useSelect";

interface SelectFieldProps {
  name: keyof Report;
  label: string;
  value: string;
  options: readonly string[];
  onChange(name: keyof Report, value: string): void;
}

export default function SelectField({
  name,
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { open, toggle, close, activeIndex, setActiveIndex } =
    useSelect(options);

  const handleSelect = (option: string) => {
    onChange(name, option);
    close();
  };

  useEffect(() => {
    if (activeIndex >= 0) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  return (
    <div className="col-span-2 mx-auto rounded-lg bg-white py-2">
      <div
        ref={wrapperRef}
        tabIndex={0}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            close();
          }
        }}
        onKeyDown={(e) => {
          if (!open) return;

          switch (e.key) {
            case "ArrowDown":
              e.preventDefault();
              setActiveIndex((prev) =>
                prev < options.length - 1 ? prev + 1 : 0,
              );
              break;

            case "ArrowUp":
              e.preventDefault();
              setActiveIndex((prev) =>
                prev > 0 ? prev - 1 : options.length - 1,
              );
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
        }}
        className="relative"
      >
        <button
          type="button"
          onClick={toggle}
          className="flex h-10 w-52 items-center justify-between rounded-lg bg-transparent px-4 text-gray-900 ring-2 ring-gray-300 focus:ring-sky-500"
        >
          <span>{value}</span>

          <ChevronUp className={open ? "rotate-180" : ""} />
        </button>

        <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600">
          {label}
        </label>

        {open && (
          <div className="absolute left-0 z-10 mt-1 max-h-32 w-52 overflow-auto rounded-md bg-neutral-800 text-white shadow-lg">
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
}

interface SelectItemProps {
  option: string;
  isActive: boolean;
  onSelect: (value: string) => void;
}

const SelectItem = forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ option, isActive, onSelect }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onMouseDown={() => onSelect(option)}
        className={`block w-full px-4 py-2 text-left text-sm ${
          isActive ? "bg-neutral-700" : "hover:bg-neutral-700"
        }`}
      >
        {option}
      </button>
    );
  },
);
