import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-52" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <Skeleton className="mb-1 h-4 w-44" />
        <Skeleton className="mb-5 h-3 w-56" />
        <Skeleton className="h-[220px] rounded-md" />
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <Skeleton className="mb-4 h-4 w-36" />
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
