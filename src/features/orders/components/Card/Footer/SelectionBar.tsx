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
    <div className="flex items-center gap-5 rounded-md border border-gray-200 bg-gray-100 p-1 text-gray-700">
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
