import type { UserRole } from "@/types";

export const APP_NAME = "BrewDesk";
export const APP_TAGLINE = "Your cafe, beautifully managed.";

/** Cookie key untuk mock auth (role-based redirect). Diganti Supabase session nanti. */
export const AUTH_COOKIE = "brewdesk_session";

/** Landing default redirect per role setelah login. */
export const ROLE_HOME: Record<UserRole, string> = {
  owner: "/reports",
  cashier: "/pos",
};

/** Route yang butuh auth (di-protect middleware). */
export const PROTECTED_PREFIXES = ["/pos", "/orders", "/menu", "/reports", "/settings"];

/** Route khusus owner. */
export const OWNER_ONLY_PREFIXES = ["/menu", "/reports", "/settings"];

export const PAYMENT_METHODS = [
  { value: "cash", label: "Tunai" },
  { value: "qris", label: "QRIS" },
] as const;

/** Demo account (landing CTA pre-fill). */
export const DEMO_OWNER = { email: "owner@brewdesk.app", password: "demo123456" };
export const DEMO_CASHIER = { email: "dinda@brewdesk.app", password: "demo123456" };
