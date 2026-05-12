export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="grid gap-3" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-lg bg-ink-100 dark:bg-white/10" />
      ))}
    </div>
  );
}
