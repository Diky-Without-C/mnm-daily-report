import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "@components/Button";

interface SelectionBarProps {
  count: number;
  onClear: () => void;
  onDelete: () => void;
}

export default function SelectionBar({
  count,
  onClear,
  onDelete,
}: SelectionBarProps) {
  return count > 0 ? (
    <div className="flex w-72 items-center justify-between rounded-lg border border-gray-300 bg-white px-2 py-1.5 shadow-sm">
      <div className="flex items-center">
        <Button className="p-1" variant="transparent" onClick={onClear}>
          <XMarkIcon className="size-4" />
        </Button>
        <span className="mr-1 text-lg font-bold text-blue-700">{count}</span>
        <span className="font-medium text-gray-700">Selected</span>
      </div>
      <Button variant="danger" className="px-3 py-2" onClick={onDelete}>
        <TrashIcon className="size-5" />
        Delete All
      </Button>
    </div>
  ) : (
    <div />
  );
}
