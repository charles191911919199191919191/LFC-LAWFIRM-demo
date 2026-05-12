export default function ChartCard({ title, subtitle, children, action }) {
  return (
    <section className="rounded-lg border border-ink-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-ink-900 dark:text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-ink-500 dark:text-ink-100">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
