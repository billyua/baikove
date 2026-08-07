import { sql } from "./db";

/**
 * Returns a slug guaranteed to be unique among graves, appending -2, -3, etc.
 * if needed. Pass excludeId when editing a grave, so it doesn't collide with
 * its own current slug.
 */
export async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = excludeId
      ? await sql`select 1 from graves where slug = ${candidate} and id != ${excludeId} limit 1`
      : await sql`select 1 from graves where slug = ${candidate} limit 1`;
    if (rows.length === 0) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}
