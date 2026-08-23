import { useMemo, useState } from "react";

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
}

export function usePagination({
  totalItems,
  itemsPerPage,
}: UsePaginationOptions) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage;

  const setFirstPage = () => {
    setPage(1);
  };

  const nextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  const previousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const getPageItems = <T>(items: T[]) => {
    return items.slice(from, to);
  };

  const pagination = useMemo(
    () => ({
      page: currentPage,
      totalPages,
      hasPrevious: currentPage > 1,
      hasNext: totalPages > 0 && currentPage < totalPages,
    }),
    [currentPage, totalPages],
  );

  return {
    ...pagination,
    setFirstPage,
    nextPage,
    previousPage,
    getPageItems,
  };
}
