import { supabase } from "./supabase";

export const supabaseService = {
  async fetchAll<T>(table: string): Promise<T[]> {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("id", { ascending: true });

    if (error) throw new Error(error.message);
    return data as T[];
  },

  async create<T>(table: string, item: T) {
    const { data, error } = await supabase.from(table).insert(item).select();

    if (error) throw new Error(error.message);
    return data?.[0];
  },

  async update<T>(table: string, id: string, payload: Partial<T>) {
    const { error } = await supabase.from(table).update(payload).eq("id", id);

    if (error) throw new Error(error.message);
  },

  async remove(table: string, id: string) {
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) throw new Error(error.message);
  },
};
