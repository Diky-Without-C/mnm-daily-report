import {
  useState,
  useId,
  useMemo,
  type KeyboardEvent,
  useEffect,
  useRef,
} from "react";
import InputText, { type InputTextProps } from "@components/Input/InputText";
import { cn } from "@utils/cn";
import DropdownMenu from "@components/Dropdown";

interface InputProps extends Omit<InputTextProps, "onChange"> {
  label?: string;
  hints?: string[];
  onChange: (value: string) => void;
}

export default function Input({
  label,
  className,
  hints,
  unit,
  onChange,
  value,
  ...props
}: InputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = ref.current?.querySelector<HTMLInputElement>("input");
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
        if (activeIndex < 0) return;
        onChange(filteredOptions[activeIndex].text);
        setIsOpen(false);
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

  return (
    <div id={id} ref={ref} className={cn("relative py-2", className)}>
      <div className="relative bg-white">
        <InputText
          onFocus={() => hints && setIsOpen(true)}
          name={label}
          type="text"
          unit={unit}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          className="uppercase"
          {...props}
        />
        {label && (
          <span className="absolute -top-3 left-4 bg-inherit px-1 text-sm text-gray-600">
            {label}
          </span>
        )}
      </div>
      <DropdownMenu
        open={isOpen && !!hints?.length && !!filteredOptions.length}
        activeIndex={activeIndex}
        variant="dark"
        ignoreSelector={`#${id}`}
        options={filteredOptions}
        onSelect={(option) => {
          onChange?.(option.text as string);
          if (inputRef) inputRef.value = option.text as string;
          setIsOpen(false);
        }}
        onClose={() => setIsOpen(false)}
        className="w-full"
      />
    </div>
  );
}
