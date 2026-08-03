import { neon } from "@neondatabase/serverless";

// DATABASE_URL is a server-only secret (no NEXT_PUBLIC_ prefix) —
// it is never sent to the browser.
export const sql = neon(process.env.DATABASE_URL);
