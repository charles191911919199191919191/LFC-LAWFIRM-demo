import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../components/ChartCard";
import { analyticsSeries } from "../data/mockData";

const completion = [
  { month: "Jan", rate: 88 },
  { month: "Feb", rate: 91 },
  { month: "Mar", rate: 89 },
  { month: "Apr", rate: 94 },
  { month: "May", rate: 92 }
];

export default function Analytics() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-extrabold uppercase text-jade-700 dark:text-jade-100">Analytics</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink-900 dark:text-white">Scheduling intelligence and firm performance</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Daily and weekly appointments" subtitle="Appointment volume from intake through completion.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(76,89,104,0.16)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#12805c" radius={[8, 8, 0, 0]} />
                <Bar dataKey="conflicts" fill="#e66f5c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Completion rate" subtitle="Confirmed consultations completed against scheduled appointments.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completion}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(76,89,104,0.16)" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#b9862d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
      <ChartCard title="Conflict frequency reports" subtitle="The backend exposes conflict frequency, workload congestion, and peak hour endpoints for live dashboards.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Double booking", "12 incidents"],
            ["Unavailable lawyer", "8 incidents"],
            ["Workload congestion", "7 incidents"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-ink-100 p-5 dark:border-white/10">
              <p className="text-sm font-semibold text-ink-500 dark:text-ink-100">{label}</p>
              <p className="mt-2 text-2xl font-extrabold text-ink-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
