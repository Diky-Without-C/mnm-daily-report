import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail with an actionable message instead of supabase-js' generic
  // "supabaseUrl is required".
  throw new Error(
    "Missing Supabase config: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "(in .env locally, in the Vercel project settings when deployed).",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
