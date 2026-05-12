import clsx from "clsx";

export default function StatCard({ icon: Icon, label, value, trend, tone = "jade" }) {
  const tones = {
    jade: "bg-jade-100 text-jade-800 dark:bg-jade-400/15 dark:text-jade-100",
    brass: "bg-brass-100 text-brass-700 dark:bg-brass-300/15 dark:text-brass-100",
    coral: "bg-signal-coral/12 text-signal-coral dark:bg-signal-coral/18",
    blue: "bg-signal-blue/10 text-signal-blue dark:bg-signal-blue/18"
  };

  return (
    <article className="rounded-lg border border-ink-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink-500 dark:text-ink-100">{label}</p>
          <p className="mt-3 text-3xl font-extrabold text-ink-900 dark:text-white">{value}</p>
        </div>
        <span className={clsx("grid h-11 w-11 place-items-center rounded-lg", tones[tone])}>{Icon && <Icon size={20} />}</span>
      </div>
      {trend && <p className="mt-4 text-xs font-bold text-jade-600 dark:text-jade-100">{trend}</p>}
    </article>
  );
}
