import { useEffect, useRef } from "react";
import { supabase } from "@apps/supabase/supabase";
import { useOnlineStore } from "@stores/useOnline.store";
import { DB_TABLES, ONLINE_CHECK_INTERVAL_MS } from "@constants/App";

async function checkConnection() {
  const { error } = await supabase.from(DB_TABLES.orders).select("id").limit(1);

  return !error;
}

export function useOnlineStatus() {
  const setStatus = useOnlineStore((s) => s.setStatus);

  const checking = useRef(false);

  const check = async () => {
    if (checking.current) return;

    checking.current = true;

    try {
      const connected = await checkConnection();

      setStatus(connected ? "online" : "offline");
    } finally {
      checking.current = false;
    }
  };

  useEffect(() => {
    check();

    const interval = setInterval(check, ONLINE_CHECK_INTERVAL_MS);

    window.addEventListener("focus", check);
    window.addEventListener("online", check);
    window.addEventListener("offline", check);

    return () => {
      clearInterval(interval);

      window.removeEventListener("focus", check);
      window.removeEventListener("online", check);
      window.removeEventListener("offline", check);
    };
  }, []);
}
