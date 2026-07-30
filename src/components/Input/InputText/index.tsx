import { useRef, useEffect, forwardRef } from "react";
import { cn } from "@utils/cn";
import { useAutocomplete } from "./useAutocomplete";
import OptionItem from "./optionItem";

export interface AutocompleteInputProps {
  label?: string;
  value: string | number;
  onChange?: (value: string) => void;
  type?: "text" | "number";
  hints?: string[];
  className?: string;
  unit?: string;
}

const Input = forwardRef<HTMLInputElement, AutocompleteInputProps>(
  (
    { label, value, onChange, type = "text", hints = [], className = "", unit },
    ref,
  ) => {
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const { show, setShow, activeIndex, setActiveIndex, filtered, reset } =
      useAutocomplete(hints, String(value));

    const handleSelect = (option: string) => {
      onChange?.(option);
      setShow(false);
      reset();
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (type === "number") {
        value = value.replace(/\D/g, "");
      }

      onChange?.(value);
      reset();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!show || filtered.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
          break;

        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
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
    };

    useEffect(() => {
      if (activeIndex >= 0) {
        itemRefs.current[activeIndex]?.scrollIntoView({
          block: "nearest",
        });
      }
    }, [activeIndex]);

    return (
      <div className={cn("bg-white py-2", className)}>
        <div className="relative">
          <input
            ref={ref}
            value={value}
            type="text"
            id={label}
            autoComplete="off"
            inputMode={type === "number" ? "numeric" : "text"}
            onFocus={() => hints.length && setShow(true)}
            onBlur={() => setTimeout(() => setShow(false), 100)}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            className="h-10 w-full rounded-md bg-transparent px-4 text-gray-900 uppercase ring-2 ring-gray-300 focus:ring-blue-400 focus:outline-none"
          />
          {label && (
            <label
              htmlFor={label}
              className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600 capitalize"
            >
              {label}
            </label>
          )}
          {unit && (
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500">
              {unit}
            </span>
          )}
          {show && filtered.length > 0 && (
            <ul
              data-ignore-click-outside
              className="absolute left-0 z-10 mt-1 max-h-32 w-full overflow-auto rounded-md bg-neutral-800 text-white shadow-lg"
            >
              {filtered.map((option, index) => (
                <li key={option}>
                  <OptionItem
                    option={option}
                    isActive={index === activeIndex}
                    onSelect={handleSelect}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
