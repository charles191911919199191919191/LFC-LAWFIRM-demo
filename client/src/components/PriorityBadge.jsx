import clsx from "clsx";

const variants = {
  "High Priority": "bg-signal-coral/12 text-signal-coral ring-signal-coral/20",
  HIGH: "bg-signal-coral/12 text-signal-coral ring-signal-coral/20",
  "Medium Priority": "bg-brass-100 text-brass-700 ring-brass-300/30",
  MEDIUM: "bg-brass-100 text-brass-700 ring-brass-300/30",
  "Regular Priority": "bg-jade-100 text-jade-800 ring-jade-400/20",
  REGULAR: "bg-jade-100 text-jade-800 ring-jade-400/20"
};

export default function PriorityBadge({ priority }) {
  const label = {
    HIGH: "High Priority",
    MEDIUM: "Medium Priority",
    REGULAR: "Regular Priority"
  }[priority] || priority;
  return (
    <span className={clsx("inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-extrabold ring-1", variants[priority] || variants["Regular Priority"])}>
      {label}
    </span>
  );
}
