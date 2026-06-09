import { Skeleton } from "@/components/ui/skeleton";

export default function MenuLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 space-y-4 border-b border-border p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <Skeleton className="h-9 w-full" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border px-5 py-3">
            <Skeleton className="h-4 w-full" />
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border-b border-border px-5 py-3.5 last:border-0">
              <Skeleton className="h-11 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
