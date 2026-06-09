import type { MenuItem, CreateMenuItemPayload, UpdateMenuItemPayload } from "@/types";
import { mockMenuItems, mockCategories } from "@/lib/mock/data";

const withCategory = (m: MenuItem): MenuItem => ({
  ...m,
  categories: mockCategories.find((c) => c.id === m.category_id) ?? null,
});

/** POS: hanya item tersedia & tidak dihapus. */
export async function getAvailableMenuItems(): Promise<MenuItem[]> {
  return mockMenuItems.filter((m) => !m.is_deleted).map(withCategory);
}

/** Owner Menu Management: semua kecuali soft-deleted. */
export async function getAllMenuItems(): Promise<MenuItem[]> {
  return mockMenuItems.filter((m) => !m.is_deleted).map(withCategory);
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const item = mockMenuItems.find((m) => m.id === id);
  return item ? withCategory(item) : null;
}

export async function createMenuItem(payload: CreateMenuItemPayload): Promise<MenuItem> {
  const now = new Date().toISOString();
  const item: MenuItem = {
    id: `menu-${Date.now()}`,
    name: payload.name,
    description: payload.description ?? null,
    price: Math.round(payload.price),
    category_id: payload.categoryId,
    image_url: payload.imageUrl ?? null,
    is_available: payload.isAvailable,
    is_deleted: false,
    created_at: now,
    updated_at: now,
  };
  mockMenuItems.push(item);
  return withCategory(item);
}

export async function updateMenuItem(payload: UpdateMenuItemPayload): Promise<MenuItem | null> {
  const item = mockMenuItems.find((m) => m.id === payload.id);
  if (!item) return null;
  if (payload.name !== undefined) item.name = payload.name;
  if (payload.description !== undefined) item.description = payload.description ?? null;
  if (payload.price !== undefined) item.price = Math.round(payload.price);
  if (payload.categoryId !== undefined) item.category_id = payload.categoryId;
  if (payload.imageUrl !== undefined) item.image_url = payload.imageUrl ?? null;
  if (payload.isAvailable !== undefined) item.is_available = payload.isAvailable;
  item.updated_at = new Date().toISOString();
  return withCategory(item);
}

export async function toggleMenuAvailable(id: string): Promise<void> {
  const item = mockMenuItems.find((m) => m.id === id);
  if (item) {
    item.is_available = !item.is_available;
    item.updated_at = new Date().toISOString();
  }
}

/** Soft delete — is_deleted = true (jaga integritas order historis). */
export async function softDeleteMenuItem(id: string): Promise<void> {
  const item = mockMenuItems.find((m) => m.id === id);
  if (item) {
    item.is_deleted = true;
    item.updated_at = new Date().toISOString();
  }
}
