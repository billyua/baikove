import { neon } from "@neondatabase/serverless";

// DATABASE_URL is a server-only secret (no NEXT_PUBLIC_ prefix) —
// it is never sent to the browser.
//
// fetchOptions: { cache: "no-store" } ensures every query hits the database
// fresh, rather than being cached by Next.js's fetch caching layer (the same
// issue we hit with Supabase earlier — the fix is the same principle here).
export const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: { cache: "no-store" },
});
