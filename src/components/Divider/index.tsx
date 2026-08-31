import { cn } from "@utils/cn";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function Divider({
  orientation = "horizontal",
  className,
}: DividerProps) {
  return (
    <div
      className={cn(
        orientation === "horizontal"
          ? "h-px w-full bg-gray-200"
          : "h-full w-px bg-gray-200",
        className,
      )}
    />
  );
}
