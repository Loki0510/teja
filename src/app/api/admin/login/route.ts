import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getExpectedAdminToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json(
      { error: "Admin login is not configured (missing ADMIN_PASSWORD)." },
      { status: 500 }
    );
  }

  if (typeof password !== "string" || password !== expectedPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, getExpectedAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
