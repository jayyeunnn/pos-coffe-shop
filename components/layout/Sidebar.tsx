"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { LogoutButton } from "./LogoutButton";
import { navForRole } from "./nav-items";
import type { Profile } from "@/types";

const ROLE_LABEL: Record<Profile["role"], string> = { owner: "Owner", cashier: "Kasir" };

export function Sidebar({ user }: { user: Profile }) {
  const pathname = usePathname();
  const items = navForRole(user.role);
  const initial = user.full_name.charAt(0).toUpperCase();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link
          href={user.role === "owner" ? "/reports" : "/pos"}
          className="flex items-center gap-2"
        >
          <Coffee className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="font-mono text-sm font-medium uppercase tracking-widest text-accent">
            {APP_NAME}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-surface-raised text-accent"
                  : "text-text-secondary hover:bg-surface-raised hover:text-text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info — bottom of sidebar, per preview */}
      <div className="shrink-0 border-t border-border px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised text-xs font-bold text-accent">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold leading-tight text-text-primary">
              {user.full_name}
            </p>
            <p className="text-[10px] leading-tight text-text-secondary">
              {ROLE_LABEL[user.role]}
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
