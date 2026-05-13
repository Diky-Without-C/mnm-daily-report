import { useRef, useEffect, forwardRef } from "react";
import { useAutocomplete } from "./useAutocomplete";

interface AutocompleteInputProps {
  name?: string;
  label?: string;
  value: string | number;
  onChange?: (name: string, value: string | number) => void;
  type?: "text" | "number";
  hints?: string[];
  className?: string;
  unit?: string;
}

export default function AutocompleteInput({
  name,
  label,
  value,
  type = "text",
  hints = [],
  onChange,
  className = "",
  unit,
}: AutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { show, setShow, activeIndex, setActiveIndex, filtered, reset } =
    useAutocomplete(hints, String(value));

  const handleSelect = (option: string) => {
    if (!onChange || !name) return;
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
    <div className={`rounded-lg bg-white py-2 ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          name={name}
          value={value}
          type="text"
          autoComplete="off"
          inputMode={type === "number" ? "numeric" : "text"}
          onChange={(e) => {
            if (!onChange || !name) return;
            let value = e.target.value;
            if (type === "number") {
              value = value.replace(/\D/g, "");
            }

            onChange(name, value);
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
          className="h-10 w-full rounded-lg bg-transparent px-4 text-gray-900 uppercase ring-2 ring-gray-300 focus:ring-sky-500"
        />

        {label && (
          <label className="absolute -top-3 left-4 bg-white px-1 text-sm text-gray-600 capitalize">
            {label}
          </label>
        )}

        {unit && (
          <span className="absolute top-1/2 right-3 -translate-y-1/2 bg-white text-sm text-gray-500">
            {unit}
          </span>
        )}

        {show && filtered.length > 0 && (
          <div className="absolute left-0 z-10 mt-1 max-h-32 w-full overflow-auto rounded-md bg-neutral-800 text-white shadow-lg">
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
