import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, sub, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            {label}
          </p>
          <p className="mt-2 truncate font-mono text-2xl font-bold text-text-primary">
            {value}
          </p>
          {sub && (
            <p className="mt-1 truncate text-xs text-text-secondary">{sub}</p>
          )}
        </div>
        <div className="shrink-0 rounded-md bg-accent/10 p-2.5">
          <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
