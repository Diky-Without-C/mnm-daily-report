import { useEffect, useRef } from "react";
import { useDarkOverlay } from "@/hooks/useDarkOverlay";

interface DeleteConfirmProps {
  onConfirm(): void;
  onCancel(): void;
}

export default function DeleteConfirm({
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  const { showOverlay, hideOverlay } = useDarkOverlay();

  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    showOverlay();

    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        onCancel();
        hideOverlay();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      hideOverlay();
    };
  }, [onCancel, showOverlay, hideOverlay]);

  return (
    <section ref={ref} className="relative rounded-lg bg-white p-4 shadow-lg">
      <p className="text-center text-lg">
        Are you sure you want to delete this order?
      </p>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onConfirm}
          className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </section>
  );
}
