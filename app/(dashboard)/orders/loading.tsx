import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="space-y-5 p-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <Skeleton className="h-4 w-full" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-b border-border px-5 py-3 last:border-0">
            <Skeleton className="h-11 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
