import { useCallback, useState } from "react";
import { supabaseService } from "@apps/supabase/service";
import { useOrdersStore } from "@stores/useOrders.store";

export function useOrderDeletion() {
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

  const { setOrders } = useOrdersStore();

  const request = useCallback((ids: string[]) => {
    if (ids.length > 0) {
      setDeleteTargetIds(ids);
    }
  }, []);

  const cancel = useCallback(() => {
    setDeleteTargetIds([]);
  }, []);

  const confirm = useCallback(async () => {
    if (deleteTargetIds.length === 0) return;

    try {
      await Promise.all(
        deleteTargetIds.map((id) => supabaseService.remove("report", id)),
      );

      setOrders((prev) =>
        prev.filter((item) => !deleteTargetIds.includes(item.id)),
      );

      setDeleteTargetIds([]);
    } catch (error) {
      console.error("Failed to delete items:", error);
    }
  }, [deleteTargetIds, setOrders]);

  return {
    isDeleting: deleteTargetIds.length > 0,
    request,
    cancel,
    confirm,
  };
}
