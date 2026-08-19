import {
  useId,
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
  forwardRef,
} from "react";
import Button from "@components/Button";
import DropdownMenu from "@components/Dropdown";
import ChevronUp from "@components/Icons/ChevronUp";
import { cn } from "@utils/cn";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  options: { text: string }[];
  className?: string;
  label?: string;
  invalid?: boolean;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { value, options, className = "", onChange, onEnter, label, invalid },
  forwardRef,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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
        onChange(options[activeIndex].text);
        setIsOpen(false);
        onEnter?.();
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(options.findIndex((option) => option.text == value));
    }
  }, [isOpen, options, value]);

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
          ref={forwardRef}
          type="button"
          onFocus={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          variant="transparent"
          className={cn(
            "text-md flex h-10 w-full items-center justify-between rounded-md bg-inherit px-4 ring-2 ring-gray-300 outline-none focus:ring-blue-400",
            invalid && "ring-red-400",
          )}
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
});

export default Select;
