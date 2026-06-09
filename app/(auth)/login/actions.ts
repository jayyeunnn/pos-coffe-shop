"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticate } from "@/lib/data/profiles";
import { encodeSession } from "@/lib/auth";
import { AUTH_COOKIE, ROLE_HOME } from "@/lib/constants";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let role: "owner" | "cashier";
  try {
    const profile = await authenticate(email, password);
    if (!profile) {
      return { error: "Email atau password salah." };
    }
    cookies().set(AUTH_COOKIE, encodeSession(profile), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });
    role = profile.role;
  } catch {
    return { error: "Gagal masuk. Coba lagi." };
  }

  redirect(ROLE_HOME[role]);
}

export async function logoutAction() {
  cookies().delete(AUTH_COOKIE);
  redirect("/login");
}
