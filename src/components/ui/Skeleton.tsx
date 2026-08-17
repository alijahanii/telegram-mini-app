import { cn } from "@/lib/format";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/[0.06]",
        className,
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.03] p-3">
      <Skeleton className="mb-3 h-28 w-full" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-3 h-3 w-1/2" />
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  );
}

export function ChannelCardSkeleton() {
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center gap-3">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  );
}
