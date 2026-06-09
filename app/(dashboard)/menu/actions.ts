"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import {
  createMenuItem,
  updateMenuItem,
  toggleMenuAvailable,
  softDeleteMenuItem,
} from "@/lib/data/menu";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/data/categories";
import type { CreateMenuItemPayload, UpdateMenuItemPayload } from "@/types";

export async function createMenuItemAction(payload: CreateMenuItemPayload) {
  await requireOwner();
  await createMenuItem(payload);
  revalidatePath("/menu");
}

export async function updateMenuItemAction(payload: UpdateMenuItemPayload) {
  await requireOwner();
  await updateMenuItem(payload);
  revalidatePath("/menu");
}

export async function toggleAvailableAction(id: string) {
  await requireOwner();
  await toggleMenuAvailable(id);
  revalidatePath("/menu");
}

export async function softDeleteMenuItemAction(id: string) {
  await requireOwner();
  await softDeleteMenuItem(id);
  revalidatePath("/menu");
}

export async function createCategoryAction(name: string) {
  await requireOwner();
  await createCategory(name.trim());
  revalidatePath("/menu");
}

export async function updateCategoryAction(id: string, name: string) {
  await requireOwner();
  await updateCategory(id, name.trim());
  revalidatePath("/menu");
}

export async function deleteCategoryAction(id: string) {
  await requireOwner();
  await deleteCategory(id);
  revalidatePath("/menu");
}
