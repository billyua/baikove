import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const sessionOptions = {
  // SESSION_SECRET is a server-only secret, at least 32 characters long.
  password: process.env.SESSION_SECRET,
  cookieName: "cemetery_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession(cookieStore, sessionOptions);
}
