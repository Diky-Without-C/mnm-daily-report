import { useEffect } from "react";
import { useDarkOverlay } from "@hooks/useDarkOverlay";
import { useClickOutside } from "@hooks/useClickOutside";

interface DeleteConfirmProps {
  onConfirm(): void;
  onCancel(): void;
}

export default function DeleteConfirm({
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  const { showOverlay, hideOverlay } = useDarkOverlay();

  const { ref } = useClickOutside<HTMLFormElement>({
    onClickOutside: () => {
      hideOverlay();
      onCancel();
    },
  });

  useEffect(() => {
    showOverlay();
  }, [showOverlay]);

  return (
    <section ref={ref} className="relative rounded-lg bg-white p-4 shadow-lg">
      <p className="text-center text-lg">
        Are you sure you want to delete this order?
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => {
            onConfirm();
            hideOverlay();
          }}
          className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
        >
          Confirm
        </button>
        <button
          onClick={() => {
            hideOverlay();
            onCancel();
          }}
          className="rounded-lg bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </section>
  );
}
