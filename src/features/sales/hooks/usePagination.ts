import { useMemo, useState, useCallback } from "react";

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
}

export function usePagination({
  totalItems,
  itemsPerPage,
}: UsePaginationOptions) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentPage = Math.min(page, totalPages);

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage;

  const setFirstPage = useCallback(() => setPage(1), []);
  const nextPage = useCallback(
    () => setPage((prev) => Math.min(prev + 1, totalPages)),
    [totalPages],
  );
  const previousPage = useCallback(
    () => setPage((prev) => Math.max(prev - 1, 1)),
    [],
  );

  const getPageItems = useCallback(
    <T>(items: T[]): T[] => items.slice(from, to),
    [from, to],
  );

  const paginationInfo = useMemo(
    () => ({
      page: currentPage,
      totalPages,
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages,
    }),
    [currentPage, totalPages],
  );

  return {
    ...paginationInfo,
    setFirstPage,
    nextPage,
    previousPage,
    getPageItems,
  };
}
