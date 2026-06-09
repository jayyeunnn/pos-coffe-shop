import Link from "next/link";
import { Coffee } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function LandingNavbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="font-serif text-lg font-bold text-text-primary">
            {APP_NAME}
          </span>
        </div>
        <Link
          href="/login"
          className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-background transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Masuk
        </Link>
      </div>
    </nav>
  );
}
