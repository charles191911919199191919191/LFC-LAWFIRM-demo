import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", message = "New activity will appear here as soon as it is available." }) {
  return (
    <div className="rounded-lg border border-dashed border-ink-100 bg-white p-8 text-center dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-jade-100 text-jade-800 dark:bg-jade-400/15 dark:text-jade-100">
        <Inbox size={22} />
      </div>
      <h3 className="mt-4 text-base font-extrabold text-ink-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-500 dark:text-ink-100">{message}</p>
    </div>
  );
}
