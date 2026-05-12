import { useMemo, useState } from "react";
import { Download, Filter, RefreshCcw, Search } from "lucide-react";
import toast from "react-hot-toast";
import AppointmentCard from "../components/AppointmentCard";
import CalendarGrid from "../components/CalendarGrid";
import ChartCard from "../components/ChartCard";
import Modal from "../components/Modal";
import PriorityBadge from "../components/PriorityBadge";
import { appointments, timeline } from "../data/mockData";

export default function AppointmentManagement() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(
    () => appointments.filter((appointment) => `${appointment.client} ${appointment.lawyer} ${appointment.type}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold uppercase text-jade-700 dark:text-jade-100">Appointment management</p>
          <h1 className="mt-1 text-2xl font-extrabold text-ink-900 dark:text-white">Requests, schedules, and conflict scans</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => toast.success("PDF receipt generated")} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-white/5">
            <Download size={16} /> Export
          </button>
          <button type="button" onClick={() => toast.success("Conflict scan refreshed")} className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ink-900 px-3 py-2 text-sm font-bold text-white dark:bg-jade-400 dark:text-ink-950">
            <RefreshCcw size={16} /> Re-scan
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-ink-100 bg-white p-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search client, lawyer, or consultation type" className="focus-ring w-full rounded-lg border border-ink-100 py-3 pl-10 pr-3 text-sm font-medium dark:border-white/10 dark:bg-ink-950" />
          </label>
          <button type="button" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-ink-100 px-4 py-3 text-sm font-bold dark:border-white/10">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Calendar scheduling view" subtitle="Visual review for overlapping or congested appointment windows.">
          <CalendarGrid />
        </ChartCard>
        <ChartCard title="Appointment queue" subtitle="Click an item to inspect activity history and receipt status.">
          <div className="grid gap-4">
            {filtered.map((appointment) => (
              <button key={appointment.id} type="button" onClick={() => setSelected(appointment)} className="text-left">
                <AppointmentCard appointment={appointment} />
              </button>
            ))}
          </div>
        </ChartCard>
      </div>

      <section className="overflow-hidden rounded-lg border border-ink-100 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-ink-50 text-xs font-extrabold uppercase text-ink-500 dark:bg-white/5 dark:text-ink-100">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Lawyer</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Conflict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-white/10">
              {filtered.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-ink-50 dark:hover:bg-white/5">
                  <td className="px-4 py-4 font-extrabold text-ink-900 dark:text-white">{appointment.id}</td>
                  <td className="px-4 py-4 text-ink-600 dark:text-ink-100">{appointment.client}</td>
                  <td className="px-4 py-4 text-ink-600 dark:text-ink-100">{appointment.lawyer}</td>
                  <td className="px-4 py-4"><PriorityBadge priority={appointment.priority} /></td>
                  <td className="px-4 py-4 font-bold text-ink-600 dark:text-ink-100">{appointment.status}</td>
                  <td className="px-4 py-4 text-ink-600 dark:text-ink-100">{appointment.conflict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={Boolean(selected)} title={selected?.id || "Appointment"} onClose={() => setSelected(null)}>
        {selected && (
          <div className="grid gap-4">
            <div className="rounded-lg bg-ink-50 p-4 dark:bg-white/5">
              <p className="font-extrabold text-ink-900 dark:text-white">{selected.type}</p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-100">{selected.client} with {selected.lawyer}</p>
            </div>
            <div className="grid gap-3">
              {timeline.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg border border-ink-100 p-3 dark:border-white/10">
                  <span className="text-sm font-bold text-ink-900 dark:text-white">{item.label}</span>
                  <span className="text-xs font-extrabold text-ink-500 dark:text-ink-100">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
