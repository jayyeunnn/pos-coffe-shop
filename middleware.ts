import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, OWNER_ONLY_PREFIXES, PROTECTED_PREFIXES, ROLE_HOME } from "@/lib/constants";
import type { UserRole } from "@/types";

function decode(value: string | undefined): { id: string; role: UserRole } | null {
  if (!value) return null;
  const [id, role] = value.split("::");
  if (!id || (role !== "owner" && role !== "cashier")) return null;
  return { id, role };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = decode(req.cookies.get(AUTH_COOKIE)?.value);

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isOwnerOnly = OWNER_ONLY_PREFIXES.some((p) => pathname.startsWith(p));

  // Sudah login tapi buka /login → lempar ke home sesuai role.
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role], req.url));
  }

  // Route terproteksi tanpa session → /login.
  if (isProtected && !session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Route owner-only diakses kasir → /pos.
  if (isOwnerOnly && session?.role === "cashier") {
    return NextResponse.redirect(new URL("/pos", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/pos/:path*", "/orders/:path*", "/menu/:path*", "/reports/:path*", "/settings/:path*"],
};
