import { cn } from "@utils/cn";

interface TabsProps<T extends string> {
  items: T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  const activeIndex = items.indexOf(value);

  return (
    <div
      className={cn(
        "relative inline-grid grid-flow-col rounded-lg bg-gray-100 p-1",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn(
            "relative z-10 rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors duration-200",
            value === item
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-800",
          )}
        >
          {item}
        </button>
      ))}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-1 left-1 rounded-md bg-white shadow-sm transition-transform duration-200 ease-out"
        style={{
          width: `calc((100% - 0.5rem) / ${items.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
    </div>
  );
}
