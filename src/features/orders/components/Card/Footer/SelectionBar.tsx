import { TrashIcon } from "@heroicons/react/24/outline";
import Button from "@components/Button";
import type { useCard } from "../useCard";

interface SelectionBarProps {
  selection: ReturnType<typeof useCard>["selection"];
  deletion: ReturnType<typeof useCard>["deletion"];
}

export default function SelectionBar({
  selection,
  deletion,
}: SelectionBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <span className="mr-1 min-w-6 text-center text-lg font-bold text-blue-700">
          {selection.selectedCount}
        </span>
        <span className="font-medium text-gray-700">Selected</span>
      </div>
      <div className="flex items-center gap-1">
        <Button className="px-3 py-2" variant="info" onClick={selection.clear}>
          Cancel
        </Button>
        <Button
          variant="danger"
          className="px-3 py-2"
          onClick={deletion.deleteSelected}
          disabled={selection.selectedCount === 0}
        >
          <TrashIcon className="size-5" />
          Delete All
        </Button>
      </div>
    </div>
  );
}
