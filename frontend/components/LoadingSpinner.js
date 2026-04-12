export default function LoadingSpinner({ size = "md", text = "Loading..." }) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
      </div>
      {text && <p className="text-sm text-[var(--color-text-muted)] animate-pulse">{text}</p>}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <div className="aspect-square animate-shimmer"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 rounded-full animate-shimmer"></div>
        <div className="h-5 w-3/4 rounded animate-shimmer"></div>
        <div className="h-3 w-full rounded animate-shimmer"></div>
        <div className="h-3 w-2/3 rounded animate-shimmer"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 w-16 rounded animate-shimmer"></div>
          <div className="h-8 w-24 rounded-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
}
