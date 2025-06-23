import { Skeleton } from "../ui/skeleton";

export const InfoCardSkeleton = () => {
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </div>
  );
};

export const RecentTransactionsSkeleton = () => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="mt-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const FinanceOverviewSkeleton = () => {
  return (
    <div className="card">
      <Skeleton className="h-6 w-40 mb-6" />
      <div className="flex justify-center items-center">
        <Skeleton className="h-64 w-64 rounded-full" />
      </div>
    </div>
  );
};

export const BarChartSkeleton = () => {
  return (
    <div className="card">
      <Skeleton className="h-6 w-48 mb-6" />
      <div className="flex items-end justify-between h-64 gap-2">
        {[...Array(7)].map((_, i) => (
          <Skeleton
            key={i}
            className={`w-full rounded-t-lg h-${Math.floor(
              Math.random() * 48 + 16
            )}`}
          />
        ))}
      </div>
    </div>
  );
};
