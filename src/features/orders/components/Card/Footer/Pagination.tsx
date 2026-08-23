import Button from "@components/Button";
import ChevronLeft from "@components/Icons/ChevronLeft";
import ChevronRight from "@components/Icons/ChevronRight";

interface PaginationProps {
  pagination: {
    page: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
    previousPage: () => void;
    nextPage: () => void;
  };
}

export default function Pagination({ pagination }: PaginationProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        className="size-7 p-1 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!pagination.hasPrevious}
        onClick={pagination.previousPage}
      >
        <ChevronLeft />
      </Button>
      <span className="w-12 text-center text-sm tabular-nums">
        {pagination.page} / {pagination.totalPages || 1}
      </span>
      <Button
        className="size-7 p-1 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!pagination.hasNext}
        onClick={pagination.nextPage}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
