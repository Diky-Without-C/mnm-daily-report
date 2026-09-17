import { useEffect, type HTMLAttributes } from "react";
import { cn } from "@utils/cn";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
}

export default function Modal({
  open,
  onClose,
  children,
  className,
  onClick,
  ...props
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-2xl ring-1 ring-black/5",
          className,
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
