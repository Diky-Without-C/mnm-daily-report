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
  return (
    <div className={cn("flex border-b border-gray-200", className)}>
      {items.map((item) => {
        const isActive = value === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium capitalize transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 focus-visible:outline-none",
              isActive
                ? "text-blue-500 after:bg-blue-500"
                : "text-gray-500 after:bg-transparent hover:text-gray-700",
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
