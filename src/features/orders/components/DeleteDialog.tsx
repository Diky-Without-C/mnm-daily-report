interface DeleteConfirmProps {
  open: boolean;
  onConfirm(): void;
  onCancel(): void;
}

export default function DeleteConfirm({
  open,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  if (!open) return null;

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <section className="rounded-lg bg-white p-4 shadow-lg">
        <p className="text-center text-lg font-semibold">
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
    </main>
  );
}
