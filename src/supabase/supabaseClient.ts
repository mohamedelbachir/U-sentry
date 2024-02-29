import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseRoleKey = import.meta.env.VITE_SUPABASE_ROLEKEY;

const adminsupabase = createClient(supabaseUrl, supabaseRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Access auth admin api
export const adminAuthClient = adminsupabase.auth.admin;
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
