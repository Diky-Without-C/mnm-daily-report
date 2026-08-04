import { useId, useState, useEffect, useRef, type KeyboardEvent } from "react";
import Button from "@components/Button";
import DropdownMenu from "@components/Dropdown";
import ChevronUp from "@components/Icons/ChevronUp";
import { cn } from "@utils/cn";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { text: string }[];
  className?: string;
  label?: string;
}

export default function Select({
  value,
  options,
  className = "",
  onChange,
  label,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
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
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
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
        onChange(options[activeIndex].text);
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(-1);
    }
  }, [isOpen]);

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
    <div ref={ref} id={id} className={cn("relative py-2", className)}>
      <div className="relative bg-white">
        <Button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          variant="transparent"
          className="flex h-10 w-full items-center justify-between rounded-md bg-inherit px-4 ring-2 ring-gray-300 focus:ring-blue-400"
        >
          <span>{value}</span>
          <ChevronUp className={isOpen ? "rotate-180" : "rotate-0"} />
        </Button>
        {label && (
          <span className="absolute -top-3 left-4 bg-inherit px-1 text-sm text-gray-600">
            {label}
          </span>
        )}
      </div>
      <DropdownMenu
        open={isOpen}
        activeIndex={activeIndex}
        ignoreSelector={`#${id}`}
        onClose={() => setIsOpen(false)}
        variant="dark"
        options={options.map((option) => ({
          text: option.text,
          onClick: () => onChange(option.text),
        }))}
        onSelect={(option) => {
          onChange(String(option.text));
        }}
        className="absolute top-full w-full -translate-y-1 overflow-y-scroll"
      />
    </div>
  );
}
