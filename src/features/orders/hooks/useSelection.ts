import { useMemo, useState, useCallback } from "react";

interface UseSelectionOptions<T> {
  items: T[];
  getId: (item: T) => string;
}

export function useSelection<T>({ items, getId }: UseSelectionOptions<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedCount = selectedIds.size;
  const isSelected = useCallback(
    (item: T) => selectedIds.has(getId(item)),
    [selectedIds, getId],
  );

  const toggle = useCallback(
    (item: T) => {
      const id = getId(item);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [getId],
  );

  const allSelected = useMemo(() => {
    return (
      items.length > 0 && items.every((item) => selectedIds.has(getId(item)))
    );
  }, [items, selectedIds, getId]);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        items.forEach((item) => next.delete(getId(item)));
      } else {
        items.forEach((item) => next.add(getId(item)));
      }
      return next;
    });
  }, [allSelected, items, getId]);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  return {
    selectedIds,
    selectedCount,
    isSelected,
    allSelected,
    toggle,
    toggleAll,
    clear,
  };
}
