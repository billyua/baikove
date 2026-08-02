import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Wrap fetch to explicitly disable caching on every request Supabase makes.
// This bypasses any caching layer (Next.js, Vercel's data cache, etc.)
// so grave data is always fresh, never stale until a redeploy.
const noCacheFetch = (url, options = {}) =>
  fetch(url, { ...options, cache: "no-store" });

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: noCacheFetch },
});
