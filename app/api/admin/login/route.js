import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "../../../../lib/db";
import { getSession } from "../../../../lib/session";

export async function POST(request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Введіть ім'я користувача та пароль." },
      { status: 400 }
    );
  }

  const rows = await sql`
    select id, username, password_hash from admins where username = ${username} limit 1
  `;
  const admin = rows[0];

  if (!admin) {
    return NextResponse.json({ error: "Невірні дані для входу." }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(password, admin.password_hash);
  if (!passwordMatches) {
    return NextResponse.json({ error: "Невірні дані для входу." }, { status: 401 });
  }

  const session = await getSession();
  session.isLoggedIn = true;
  session.username = admin.username;
  await session.save();

  return NextResponse.json({ success: true });
}

