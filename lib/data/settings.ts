import type { CafeSettings } from "@/types";
import { mockCafeSettings } from "@/lib/mock/data";

export async function getCafeSettings(): Promise<CafeSettings> {
  return { ...mockCafeSettings };
}

export async function updateCafeSettings(
  patch: Partial<Pick<CafeSettings, "cafe_name" | "address" | "phone" | "footer_note">>,
): Promise<CafeSettings> {
  Object.assign(mockCafeSettings, patch, { updated_at: new Date().toISOString() });
  return { ...mockCafeSettings };
}
