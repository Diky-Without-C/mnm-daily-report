import Button from "@components/Button";
import Trash from "@components/Icons/Trash";
import XMark from "@components/Icons/XMark";

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
          <XMark />
        </Button>
        <span className="mr-1 text-lg font-bold text-blue-700">{count}</span>
        <span className="font-medium text-gray-700">Selected</span>
      </div>
      <Button variant="error" className="px-3 py-2" onClick={onDelete}>
        Delete All
        <Trash />
      </Button>
    </div>
  ) : (
    <div />
  );
}
