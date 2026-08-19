import {
  useState,
  useId,
  useMemo,
  type KeyboardEvent,
  useEffect,
  useRef,
  forwardRef,
} from "react";
import InputText, { type InputTextProps } from "@components/Input/InputText";
import { cn } from "@utils/cn";
import DropdownMenu from "@components/Dropdown";

interface InputProps extends Omit<InputTextProps, "onChange"> {
  label?: string;
  hints?: string[];
  onChange: (value: string) => void;
  onEnter?: () => void;
  invalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    className,
    hints,
    unit,
    onChange,
    onEnter,
    value,
    invalid,
    ...props
  },
  forwardRef,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const filteredOptions = useMemo(() => {
    return (
      hints
        ?.filter((hint) =>
          hint.toLowerCase().includes((value as string)?.toLowerCase() || ""),
        )
        .map((hint) => ({ text: hint })) ?? []
    );
  }, [hints, value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(0);
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;

      case "Escape":
        setIsOpen(false);
        break;

      case "Enter":
        e.preventDefault();
        onChange(filteredOptions[activeIndex]?.text ?? value);
        setIsOpen(false);
        onEnter?.();
        break;
    }
  };

  useEffect(() => {
    const itemRefs = ref.current?.querySelectorAll<HTMLLIElement>(
      "li",
    ) as NodeListOf<HTMLLIElement>;
    if (activeIndex >= 0) {
      itemRefs[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    setActiveIndex(0);
  }, [value]);

  return (
    <div id={id} ref={ref} className={cn("relative py-2", className)}>
      <div className="relative bg-white">
        <InputText
          ref={forwardRef}
          onFocus={() => {
            if (filteredOptions.length) {
              setIsOpen(true);
            }
          }}
          name={label}
          unit={unit}
          value={value}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          className={cn("uppercase", invalid && "ring-red-400")}
          {...props}
        />
        {label && (
          <span className="absolute -top-3 left-4 bg-inherit px-1 text-sm text-gray-600">
            {label}
          </span>
        )}
      </div>
      <DropdownMenu
        open={isOpen && filteredOptions.length > 0}
        activeIndex={activeIndex}
        variant="dark"
        ignoreSelector={`#${id}`}
        options={filteredOptions}
        onSelect={(option) => {
          onChange?.(option.text as string);
          setIsOpen(false);
        }}
        onClose={() => setIsOpen(false)}
        className="w-full"
      />
    </div>
  );
});

export default Input;
