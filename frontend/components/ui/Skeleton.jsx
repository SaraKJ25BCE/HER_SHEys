import { cx } from "@/lib/utils";

export default function Skeleton({ className }) {
  return <div className={cx("animate-pulse rounded bg-sunk", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="border border-border rounded-lg p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-24 mt-2" />
    </div>
  );
}
