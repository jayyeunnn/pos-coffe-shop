import Link from "next/link";
import { Coffee } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-text-secondary sm:flex-row">
        <div className="flex items-center gap-2">
          <Coffee className="h-4 w-4 text-accent" aria-hidden="true" />
          <span className="font-medium text-text-primary">{APP_NAME}</span>
          <span aria-hidden="true">·</span>
          <span>POS untuk coffee shop Indonesia</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-sm transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          >
            Coba Demo
          </Link>
          <span>© {new Date().getFullYear()} BrewDesk</span>
        </div>
      </div>
    </footer>
  );
}
