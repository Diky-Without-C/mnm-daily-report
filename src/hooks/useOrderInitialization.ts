import { useEffect, useRef } from "react";
import type { Report } from "@apps/supabase/report.dto";
import { useSupabaseQuery } from "@apps/supabase/useSupabaseQuery";
import { useOrdersStore } from "@stores/useOrders.store";
import { useOnlineStore } from "@stores/useOnline.store";

export function useOrdersInitialization() {
  const { data: report, refetch } = useSupabaseQuery<Report>("report");
  const { setOrders } = useOrdersStore();
  const { status } = useOnlineStore();

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
    if (report.length > 0 && status === "online") {
      setOrders(report);
    }
  }, [report, status, setOrders]);
}
