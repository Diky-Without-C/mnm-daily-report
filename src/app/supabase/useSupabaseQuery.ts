import { useEffect, useState } from "react";
import { supabaseService } from "./service";

export function useSupabaseQuery<T>(table: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      try {
        setLoading(true);
        const result = await supabaseService.fetchAll<T>(table);
        if (mounted) setData(result);
      } catch (err: any) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();

    return () => {
      mounted = false;
    };
  }, [table]);

  return { data, loading, error };
}
