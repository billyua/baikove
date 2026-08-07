import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";
import { getSession } from "../../../../lib/session";
import { buildGraveSlugBase, slugify } from "../../../../lib/transliterate";
import { ensureUniqueSlug } from "../../../../lib/slugServer";

export async function DELETE(request, { params }) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Не авторизовано." }, { status: 401 });
  }

  const currentSlug = params.slug;

  try {
    const rows = await sql`
      delete from graves where slug = ${currentSlug} returning id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Поховання не знайдено." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Не авторизовано." }, { status: 401 });
  }

  const currentSlug = params.slug;
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

  try {
    const existingRows = await sql`
      select id from graves where slug = ${currentSlug} limit 1
    `;
    const existing = existingRows[0];

    if (!existing) {
      return NextResponse.json(
        { error: "Поховання не знайдено." },
        { status: 404 }
      );
    }

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

    const newSlug =
      baseSlug === currentSlug
        ? currentSlug
        : await ensureUniqueSlug(baseSlug, existing.id);

    const rows = await sql`
      update graves set
        slug = ${newSlug},
        last_name = ${body.last_name},
        first_name = ${body.first_name},
        middle_name = ${body.middle_name || null},
        birth_year = ${body.birth_year || null},
        death_year = ${body.death_year || null},
        occupation = ${body.occupation || null},
        description = ${body.description || null},
        grave_section = ${body.grave_section || null},
        photo_url = ${body.photo_url || null},
        direction_text = ${body.direction_text || null},
        direction_scheme_url = ${body.direction_scheme_url || null},
        latitude = ${body.latitude},
        longitude = ${body.longitude}
      where id = ${existing.id}
      returning *;
    `;

    return NextResponse.json({ grave: rows[0] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
