import { useCallback, useState } from "react";
import { supabaseService } from "@apps/supabase/service";
import { useOrdersStore } from "@stores/useOrders.store";
import { toast } from "@stores/useToast.store";
import { DB_TABLES } from "@constants/App";

export function useOrderDeletion() {
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

  const setOrders = useOrdersStore((state) => state.setOrders);

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
      // One request: either every row is deleted or none, so the UI can't end
      // up out of sync with the database after a partial failure.
      await supabaseService.removeMany(DB_TABLES.orders, deleteTargetIds);

      setOrders((prev) =>
        prev.filter((item) => !deleteTargetIds.includes(item.id)),
      );

      setDeleteTargetIds([]);
    } catch (error) {
      console.error("Failed to delete items:", error);
      toast.error(
        "Couldn't delete the selected orders. Nothing was removed — please try again.",
      );
    }
  }, [deleteTargetIds, setOrders]);

  return {
    isDeleting: deleteTargetIds.length > 0,
    request,
    cancel,
    confirm,
  };
}
