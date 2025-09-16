import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export function useSupabase<T extends { id?: string }>(tableName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const { data: result, error } = await supabase
      .from(tableName)
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setData((result as T[]) || []);
    setLoading(false);
  };

  const create = async (item: Omit<T, "id">) => {
    const { data: inserted, error } = await supabase
      .from(tableName)
      .insert(item)
      .select();
    if (error) throw new Error(error.message);
    await fetchData();
    return inserted?.[0]?.id as string;
  };

  const update = async (id: string, updatedData: Partial<T>) => {
    const { error } = await supabase
      .from(tableName)
      .update(updatedData)
      .eq("id", id);
    if (error) throw new Error(error.message);
    await fetchData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) throw new Error(error.message);
    await fetchData();
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel(`realtime-${tableName}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        () => fetchData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName]);

  return { data, loading, error, create, update, remove, refetch: fetchData };
}
