import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sql } from "../../../lib/db";
import { getSession } from "../../../lib/session";
import { buildGraveSlugBase, slugify } from "../../../lib/transliterate";

async function ensureUniqueSlug(baseSlug) {
  let candidate = baseSlug;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = await sql`select 1 from graves where slug = ${candidate} limit 1`;
    if (rows.length === 0) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Не авторизовано." }, { status: 401 });
  }

  const body = await request.json();

  if (
    !body.last_name ||
    !body.first_name ||
    body.latitude === undefined ||
    body.latitude === null ||
    body.longitude === undefined ||
    body.longitude === null
  ) {
    return NextResponse.json(
      { error: "Заповніть обов'язкові поля: прізвище, ім'я, координати." },
      { status: 400 }
    );
  }

  const id = randomUUID();

  // Use the admin-provided slug if they edited it, otherwise auto-generate
  // from (birth year)-(death year)-(transliterated surname).
  const rawSlug =
    body.slug && body.slug.trim()
      ? body.slug
      : buildGraveSlugBase(body.last_name, body.birth_year, body.death_year);
  const baseSlug = slugify(rawSlug);

  if (!baseSlug) {
    return NextResponse.json(
      { error: "Не вдалося сформувати URL для цього запису." },
      { status: 400 }
    );
  }

  try {
    const slug = await ensureUniqueSlug(baseSlug);

    const rows = await sql`
      insert into graves (
        id, slug, last_name, first_name, middle_name, birth_year, death_year,
        occupation, description, grave_section, photo_url,
        direction_text, direction_scheme_url, latitude, longitude
      ) values (
        ${id}, ${slug}, ${body.last_name}, ${body.first_name}, ${body.middle_name || null},
        ${body.birth_year || null}, ${body.death_year || null}, ${body.occupation || null},
        ${body.description || null}, ${body.grave_section || null}, ${body.photo_url || null},
        ${body.direction_text || null}, ${body.direction_scheme_url || null},
        ${body.latitude}, ${body.longitude}
      )
      returning *;
    `;

    return NextResponse.json({ grave: rows[0] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
