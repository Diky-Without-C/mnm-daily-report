import { useEffect, useRef } from "react";
import type { OrderSchema } from "@apps/supabase/Order.Schema.dto";
import { useSupabaseQuery } from "@apps/supabase/useSupabaseQuery";
import { useOrdersStore } from "@stores/useOrders.store";
import { useOnlineStore } from "@stores/useOnline.store";
import { DB_TABLES } from "@constants/App";

export function useOrdersInitialization() {
  const {
    data: report,
    loading,
    refetch,
  } = useSupabaseQuery<OrderSchema>(DB_TABLES.orders);
  const setOrders = useOrdersStore((state) => state.setOrders);
  const status = useOnlineStore((state) => state.status);

  const wasOffline = useRef(false);

  useEffect(() => {
    if (status === "offline") {
      wasOffline.current = true;
      return;
    }

    if (status === "online" && wasOffline.current) {
      wasOffline.current = false;
      refetch();
    }
  }, [status, refetch]);

  useEffect(() => {
    // Sync once a fetch has finished — including an EMPTY table. (It used to
    // require `report.length > 0`, so deleting the last order elsewhere never
    // reached this device.)
    if (!loading && status === "online") {
      setOrders(report);
    }
  }, [report, loading, status, setOrders]);
}
