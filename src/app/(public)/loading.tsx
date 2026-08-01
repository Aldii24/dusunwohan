import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8 md:pt-44">
      <Skeleton className="h-4 w-40 rounded-full" />
      <Skeleton className="mt-5 h-12 w-3/4 max-w-xl rounded-2xl" />
      <Skeleton className="mt-4 h-5 w-full max-w-md rounded-full" />
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl border border-border/70 bg-card">
            <Skeleton className="aspect-[3/2] rounded-none" />
            <div className="space-y-3 p-6">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-5 w-4/5 rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
