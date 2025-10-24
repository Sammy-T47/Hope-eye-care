import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Explicitly type it as a SupabaseClient
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
