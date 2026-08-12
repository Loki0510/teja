import "server-only";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "rukshaa_admin";

// The session "token" is just the shared secret itself. The cookie is
// httpOnly so client-side JS can never read it; middleware compares the
// incoming cookie value against the env secret on every /admin request.
export function getExpectedAdminToken() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET env var.");
  }
  return secret;
}

// Defense in depth: middleware already protects /admin and /api/admin
// routes, but Server Actions are worth re-checking directly since they
// can in principle be invoked from anywhere the action reference leaks to.
export async function requireAdmin() {
  const store = await cookies();
  const cookie = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!cookie || cookie !== getExpectedAdminToken()) {
    throw new Error("Unauthorized");
  }
}
