import { Coffee, Receipt, UtensilsCrossed, BarChart3, Settings, type LucideIcon } from "lucide-react";
import type { UserRole } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/pos", label: "POS", icon: Coffee, roles: ["owner", "cashier"] },
  { href: "/orders", label: "Riwayat", icon: Receipt, roles: ["owner", "cashier"] },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed, roles: ["owner"] },
  { href: "/reports", label: "Laporan", icon: BarChart3, roles: ["owner"] },
  { href: "/settings", label: "Pengaturan", icon: Settings, roles: ["owner"] },
];

export const navForRole = (role: UserRole) => NAV_ITEMS.filter((i) => i.roles.includes(role));
