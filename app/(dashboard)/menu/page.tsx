import { requireOwner } from "@/lib/auth";
import { getAllMenuItems } from "@/lib/data/menu";
import { getCategories } from "@/lib/data/categories";
import { MenuInterface } from "@/components/menu/MenuInterface";

export const metadata = { title: "Menu — BrewDesk" };

export default async function MenuPage() {
  await requireOwner();

  const [items, categories] = await Promise.all([
    getAllMenuItems(),
    getCategories(),
  ]);

  return <MenuInterface items={items} categories={categories} />;
}
