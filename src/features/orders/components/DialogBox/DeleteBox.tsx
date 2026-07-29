import Button from "@components/Button";
import Dialog from "@components/Dialog";

interface DeleteConfirmProps {
  open: boolean;
  onConfirm(): void;
  onCancel(): void;
}

export default function DeleteBox({
  open,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  return (
    <Dialog open={open} onClose={onCancel} className="max-w-md p-6">
      <h1 className="text-xl font-semibold">Delete Order</h1>
      <p className="mt-3 text-gray-600">
        You're about to permanently delete this order. Are you sure you want to
        continue?
      </p>
      <div className="mt-8 flex justify-end gap-2">
        <Button onClick={onCancel} variant="error">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="info">
          Delete
        </Button>
      </div>
    </Dialog>
  );
}
