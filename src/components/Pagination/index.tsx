import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Button from "@components/Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  previousPage: () => void;
  nextPage: () => void;
}

export default function Pagination({
  page,
  totalPages,
  hasPrevious,
  hasNext,
  previousPage,
  nextPage,
}: PaginationProps) {
  return (
    <nav aria-label="Pagination" className="flex items-center gap-3">
      <Button
        className="size-7 p-1 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
        disabled={!hasPrevious}
        onClick={previousPage}
      >
        <ChevronLeftIcon className="size-6" />
      </Button>
      <span aria-live="polite" className="w-12 text-center text-sm">
        {page} / {totalPages || 1}
      </span>
      <Button
        className="size-7 p-1 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
        disabled={!hasNext}
        onClick={nextPage}
      >
        <ChevronRightIcon className="size-6" />
      </Button>
    </nav>
  );
}
