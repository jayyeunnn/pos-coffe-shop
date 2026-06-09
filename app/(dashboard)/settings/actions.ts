"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { updateProfileName, createCashier, toggleCashierActive } from "@/lib/data/profiles";
import { updateCafeSettings } from "@/lib/data/settings";
import type { CafeSettings } from "@/types";

export async function updateProfileNameAction(name: string) {
  const user = await requireOwner();
  await updateProfileName(user.id, name.trim());
  revalidatePath("/settings");
}

export async function updateCafeSettingsAction(
  patch: Partial<Pick<CafeSettings, "cafe_name" | "address" | "phone" | "footer_note">>
) {
  await requireOwner();
  await updateCafeSettings(patch);
  revalidatePath("/settings");
}

export async function createCashierAction(fullName: string) {
  await requireOwner();
  await createCashier(fullName.trim());
  revalidatePath("/settings");
}

export async function toggleCashierActiveAction(id: string) {
  await requireOwner();
  await toggleCashierActive(id);
  revalidatePath("/settings");
}
