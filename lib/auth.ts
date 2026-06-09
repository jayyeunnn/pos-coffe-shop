// ============================================================
// Mock Auth — session via cookie. Server-only helpers.
// Cookie value: "<profileId>::<role>" (self-contained untuk
// dibaca middleware Edge tanpa import data).
// Saat integrasi Supabase: ganti dengan supabase.auth.getUser().
// ============================================================

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Profile, UserRole } from "@/types";
import { AUTH_COOKIE } from "@/lib/constants";
import { getProfileById } from "@/lib/data/profiles";

export interface Session {
  id: string;
  role: UserRole;
}

export function encodeSession(profile: Profile): string {
  return `${profile.id}::${profile.role}`;
}

export function decodeSession(value: string | undefined): Session | null {
  if (!value) return null;
  const [id, role] = value.split("::");
  if (!id || (role !== "owner" && role !== "cashier")) return null;
  return { id, role };
}

/** Session ringan dari cookie (server component / action). */
export function getSession(): Session | null {
  return decodeSession(cookies().get(AUTH_COOKIE)?.value);
}

/** Profile lengkap user saat ini, atau null. */
export async function getCurrentUser(): Promise<Profile | null> {
  const session = getSession();
  if (!session) return null;
  return getProfileById(session.id);
}

/** Wajib login — redirect ke /login jika tidak. */
export async function requireUser(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Wajib owner — redirect ke /pos jika kasir, /login jika anonim. */
export async function requireOwner(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "owner") redirect("/pos");
  return user;
}
