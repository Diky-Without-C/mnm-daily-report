import { useCallback, useState } from "react";
import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import { supabaseService } from "@apps/supabase/service";

interface UseOrderDeletionParams {
  setOrders: React.Dispatch<React.SetStateAction<OrderSchema[]>>;
}

export function useOrderDeletion({ setOrders }: UseOrderDeletionParams) {
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

  const requestDelete = useCallback((ids: string[]) => {
    if (ids.length > 0) {
      setDeleteTargetIds(ids);
    }
  }, []);

  const cancelDelete = useCallback(() => {
    setDeleteTargetIds([]);
  }, []);

  const confirmDelete = useCallback(async () => {
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
    handlers: {
      requestDelete,
      confirmDelete,
      cancelDelete,
    },
  };
}
