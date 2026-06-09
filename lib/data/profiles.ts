import type { Profile, UserRole } from "@/types";
import { mockProfiles, mockCredentials } from "@/lib/mock/data";

export async function getProfileById(id: string): Promise<Profile | null> {
  return mockProfiles.find((p) => p.id === id) ?? null;
}

/** Mock auth: verifikasi email+password, return profile jika valid. */
export async function authenticate(email: string, password: string): Promise<Profile | null> {
  const cred = mockCredentials[email.toLowerCase().trim()];
  if (!cred || cred.password !== password) return null;
  const profile = mockProfiles.find((p) => p.id === cred.profileId);
  if (!profile || !profile.is_active) return null;
  return profile;
}

/** Owner: daftar semua kasir. */
export async function getCashiers(): Promise<Profile[]> {
  return mockProfiles.filter((p) => p.role === "cashier");
}

export async function createCashier(fullName: string): Promise<Profile> {
  const profile: Profile = {
    id: `kasir-${Date.now()}`,
    full_name: fullName,
    role: "cashier",
    is_active: true,
    created_at: new Date().toISOString(),
  };
  mockProfiles.push(profile);
  return profile;
}

export async function toggleCashierActive(id: string): Promise<void> {
  const p = mockProfiles.find((x) => x.id === id);
  if (p) p.is_active = !p.is_active;
}

export async function updateProfileName(id: string, fullName: string): Promise<void> {
  const p = mockProfiles.find((x) => x.id === id);
  if (p) p.full_name = fullName;
}

export function roleHome(role: UserRole): string {
  return role === "owner" ? "/reports" : "/pos";
}
