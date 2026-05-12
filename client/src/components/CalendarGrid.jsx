const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = ["08:00", "09:30", "11:00", "13:30", "15:00"];

export default function CalendarGrid() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px] rounded-lg border border-ink-100 dark:border-white/10">
        <div className="grid grid-cols-[90px_repeat(6,1fr)] border-b border-ink-100 bg-ink-50 text-xs font-extrabold uppercase text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-ink-100">
          <div className="p-3">Time</div>
          {days.map((day) => <div key={day} className="p-3">{day}</div>)}
        </div>
        {hours.map((hour, row) => (
          <div key={hour} className="grid grid-cols-[90px_repeat(6,1fr)] border-b border-ink-100 last:border-b-0 dark:border-white/10">
            <div className="p-3 text-xs font-bold text-ink-500 dark:text-ink-100">{hour}</div>
            {days.map((day, index) => {
              const busy = (row + index) % 4 === 0;
              const watch = (row + index) % 7 === 0;
              return (
                <div key={`${day}-${hour}`} className="calendar-slot border-l border-ink-100 p-2 dark:border-white/10">
                  <div className={`h-full rounded-lg px-2 py-2 text-xs font-bold ${busy ? "bg-jade-100 text-jade-800" : watch ? "bg-brass-100 text-brass-700" : "bg-ink-50 text-ink-400 dark:bg-white/5 dark:text-ink-100"}`}>
                    {busy ? "Booked" : watch ? "Capacity watch" : "Open"}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
