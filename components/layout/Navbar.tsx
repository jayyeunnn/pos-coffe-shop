"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";
import { navForRole } from "./nav-items";
import { ThemeToggle } from "./ThemeToggle";
import { LogoutButton } from "./LogoutButton";

const ROLE_LABEL: Record<Profile["role"], string> = { owner: "Owner", cashier: "Kasir" };

const PAGE_INFO: Record<string, { title: string; subtitle: string }> = {
  "/pos":      { title: "POS",           subtitle: "Proses pesanan kasir" },
  "/orders":   { title: "Riwayat Order", subtitle: "Semua transaksi" },
  "/menu":     { title: "Menu",          subtitle: "Kelola daftar menu" },
  "/reports":  { title: "Dashboard",     subtitle: "Ringkasan performa hari ini" },
  "/settings": { title: "Pengaturan",    subtitle: "Profil, info cafe, dan manajemen kasir" },
};

export function Navbar({ user }: { user: Profile }) {
  const pathname = usePathname();
  const mobileItems = navForRole(user.role);
  const initial = user.full_name.charAt(0).toUpperCase();
  const pageInfo = PAGE_INFO[pathname];

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      {/* Mobile: nav icon links */}
      <nav className="flex items-center gap-1 overflow-x-auto lg:hidden">
        {mobileItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                active
                  ? "bg-surface-raised text-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>

      {/* Desktop: page title + subtitle */}
      <div className="hidden lg:flex lg:flex-col lg:justify-center">
        {pageInfo && (
          <>
            <p className="text-sm font-semibold leading-tight text-text-primary">
              {pageInfo.title}
            </p>
            <p className="mt-0.5 text-xs leading-tight text-text-secondary">
              {pageInfo.subtitle}
            </p>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* User info — mobile only; desktop shows in sidebar bottom */}
        <div className="flex items-center gap-2 rounded-md px-2 py-1 lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-medium text-accent">
            {initial}
          </span>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-tight text-text-primary">{user.full_name}</p>
            <p className="text-xs leading-tight text-text-secondary">{ROLE_LABEL[user.role]}</p>
          </div>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}
