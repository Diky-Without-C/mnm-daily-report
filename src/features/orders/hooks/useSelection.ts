import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import { useMemo, useState, useCallback } from "react";

interface UseSelectionOptions {
  items: OrderSchema[];
}

export function useSelection({ items }: UseSelectionOptions) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedCount = selectedIds.size;
  const isSelected = useCallback(
    (item: OrderSchema) => selectedIds.has(item.id),
    [selectedIds],
  );

  const toggle = useCallback((item: OrderSchema) => {
    const id = item.id;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const allSelected = useMemo(() => {
    return items.length > 0 && items.every((item) => selectedIds.has(item.id));
  }, [items, selectedIds]);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        items.forEach((item) => next.delete(item.id));
      } else {
        items.forEach((item) => next.add(item.id));
      }
      return next;
    });
  }, [allSelected, items]);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  return {
    selectedIds: Array.from(selectedIds),
    selectedCount,
    isSelected,
    allSelected,
    toggle,
    toggleAll,
    clear,
  };
}
