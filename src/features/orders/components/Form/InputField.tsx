import { useRef, useEffect, forwardRef } from "react";
import type { Report } from "@/app/supabase/report.dto";
import { useAutocomplete } from "./useAutocomplete";

interface InputFieldProps {
  name: keyof Report;
  label: string;
  value: string | number;
  onChange(name: keyof Report, value: string | number): void;
  type?: "text" | "number";
  hints?: string[];
  className?: string;
}

export default function InputField({
  name,
  label,
  value,
  type = "text",
  hints = [],
  onChange,
  className = "",
}: InputFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { show, setShow, activeIndex, setActiveIndex, filtered, reset } =
    useAutocomplete(hints, String(value));

  const handleSelect = (option: string) => {
    onChange(name, option);
    setShow(false);
    reset();
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
      <div className="relative">
        <input
          ref={inputRef}
          name={name}
          value={value}
          type="text"
          autoComplete="off"
          inputMode={type === "number" ? "numeric" : "text"}
          onChange={(e) => {
            onChange(name, e.target.value);
            reset();
          }}
          onFocus={() => hints.length && setShow(true)}
          onBlur={() => setTimeout(() => setShow(false), 100)}
          onKeyDown={(e) => {
            if (!show || filtered.length === 0) return;

            switch (e.key) {
              case "ArrowDown":
                e.preventDefault();
                setActiveIndex((prev) =>
                  prev < filtered.length - 1 ? prev + 1 : 0,
                );
                break;

              case "ArrowUp":
                e.preventDefault();
                setActiveIndex((prev) =>
                  prev > 0 ? prev - 1 : filtered.length - 1,
                );
                break;

              case "Enter":
                e.preventDefault();
                if (activeIndex >= 0) {
                  handleSelect(filtered[activeIndex]);
                }
                break;

              case "Escape":
                setShow(false);
                break;
            }
          }}
          className={`${className} h-10 w-52 rounded-lg bg-transparent px-4 text-gray-900 ring-2 ring-gray-300 focus:ring-sky-500`}
        />

        <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600">
          {label}
        </label>

        {show && filtered.length > 0 && (
          <div className="absolute left-0 z-10 mt-1 max-h-32 w-52 overflow-auto rounded-md bg-neutral-800 text-white shadow-lg">
            {filtered.map((option, index) => (
              <AutocompleteItem
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

interface ItemProps {
  option: string;
  isActive: boolean;
  onSelect: (value: string) => void;
}

const AutocompleteItem = forwardRef<HTMLButtonElement, ItemProps>(
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
