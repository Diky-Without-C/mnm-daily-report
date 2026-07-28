import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ITEMS_PER_PAGE } from "../sales.constant";

interface UsePaginationOptions<T> {
  items: T[];
}

export function usePagination<T>({ items }: UsePaginationOptions<T>) {
  const [page, setPage] = useState(1);

  const previousItems = useRef(items);

  useEffect(() => {
    if (previousItems.current !== items) {
      setPage(1);
      previousItems.current = items;
    }
  }, [items]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE)),
    [items.length],
  );

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const displayedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, page]);

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    displayedItems,
    page,
    totalPages,
    totalItems: items.length,
    isFirstPage: page === 1,
    isLastPage: page === totalPages,
    nextPage,
    prevPage,
    resetPage,
    setPage,
  };
}
