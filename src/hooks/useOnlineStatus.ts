import { useEffect, useRef } from "react";
import { useOnlineStore } from "@/store/useOnline.store";
import { supabase } from "@/app/supabase/supabase";

const INTERVAL = 30000;

async function checkConnection() {
  const { error } = await supabase.from("report").select("id").limit(1);

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

    const interval = setInterval(check, INTERVAL);

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
