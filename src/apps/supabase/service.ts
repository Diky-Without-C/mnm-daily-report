import { isNetworkError, setOffline, setOnline } from "@stores/useOnline.store";
import { supabase } from "./supabase";

async function execute<T>(query: Promise<T>) {
  try {
    const result = await query;

    setOnline();

    return result;
  } catch (error) {
    if (isNetworkError(error)) {
      setOffline();
    }

    throw error;
  }
}

export const supabaseService = {
  fetchAll<T>(table: string) {
    return execute(
      (async () => {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .order("id");

        if (error) throw error;

        return data as T[];
      })(),
    );
  },

  create<T>(table: string, item: T) {
    return execute(
      (async () => {
        const { data, error } = await supabase
          .from(table)
          .insert(item)
          .select();

        if (error) throw error;

        return data?.[0];
      })(),
    );
  },

  update<T>(table: string, id: string, payload: Partial<T>) {
    return execute(
      (async () => {
        const { error } = await supabase
          .from(table)
          .update(payload)
          .eq("id", id);

        if (error) throw error;
      })(),
    );
  },

  remove(table: string, id: string) {
    return execute(
      (async () => {
        const { error } = await supabase.from(table).delete().eq("id", id);

        if (error) throw error;
      })(),
    );
  },
};
