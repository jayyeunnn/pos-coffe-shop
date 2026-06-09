import { getAvailableMenuItems } from "@/lib/data/menu";
import { getCategories } from "@/lib/data/categories";
import { getCafeSettings } from "@/lib/data/settings";
import { PosInterface } from "@/components/pos/PosInterface";

export const metadata = { title: "POS — BrewDesk" };

export default async function PosPage() {
  const [menuItems, categories, cafeSettings] = await Promise.all([
    getAvailableMenuItems(),
    getCategories(),
    getCafeSettings(),
  ]);

  return (
    <PosInterface
      menuItems={menuItems}
      categories={categories}
      cafeSettings={cafeSettings}
    />
  );
}
