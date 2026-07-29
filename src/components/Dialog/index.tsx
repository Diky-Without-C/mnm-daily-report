import { useEffect, type HTMLAttributes } from "react";
import { useClickOutside } from "@hooks/useClickOutside";
import { cn } from "@utils/cn";

interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
}

export default function Dialog({
  open,
  onClose,
  children,
  className,
  ...props
}: DialogProps) {
  const { ref } = useClickOutside<HTMLDivElement>({
    enabled: open,
    onClickOutside: onClose,
    ignoreSelector: "[data-ignore-click-outside]",
  });

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]">
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl ring-1 ring-black/5",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
