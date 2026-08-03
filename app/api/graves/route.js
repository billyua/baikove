import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sql } from "../../../lib/db";
import { getSession } from "../../../lib/session";

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

  try {
    const rows = await sql`
      insert into graves (
        id, last_name, first_name, middle_name, birth_year, death_year,
        occupation, description, grave_section, photo_url,
        direction_text, direction_scheme_url, latitude, longitude
      ) values (
        ${id}, ${body.last_name}, ${body.first_name}, ${body.middle_name || null},
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
