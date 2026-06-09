import type { Category } from "@/types";
import { mockCategories } from "@/lib/mock/data";

/** Semua kategori, urut sort_order. */
export async function getCategories(): Promise<Category[]> {
  return [...mockCategories].sort((a, b) => a.sort_order - b.sort_order);
}

export async function createCategory(name: string): Promise<Category> {
  const cat: Category = {
    id: `cat-${Date.now()}`,
    name,
    sort_order: mockCategories.length + 1,
    created_at: new Date().toISOString(),
  };
  mockCategories.push(cat);
  return cat;
}

export async function updateCategory(id: string, name: string): Promise<void> {
  const cat = mockCategories.find((c) => c.id === id);
  if (cat) cat.name = name;
}

export async function deleteCategory(id: string): Promise<void> {
  const idx = mockCategories.findIndex((c) => c.id === id);
  if (idx !== -1) mockCategories.splice(idx, 1);
}
