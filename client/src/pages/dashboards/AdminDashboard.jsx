import { Activity, AlertTriangle, CalendarRange, Gauge, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../../components/ChartCard";
import StatCard from "../../components/StatCard";
import { analyticsSeries, workloadDistribution } from "../../data/mockData";

const colors = ["#34c48f", "#e3bd5e", "#4278f5", "#e66f5c"];

export default function AdminDashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Active users" value="1,248" trend="+8.4% this month" />
        <StatCard icon={CalendarRange} label="Appointments" value="436" trend="92% completion rate" tone="blue" />
        <StatCard icon={AlertTriangle} label="Conflicts" value="27" trend="6.2% frequency" tone="coral" />
        <StatCard icon={Gauge} label="Avg workload" value="68%" trend="Balanced across counsel" tone="brass" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Appointments and conflicts" subtitle="Daily operational volume with detected schedule conflicts.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsSeries}>
                <defs>
                  <linearGradient id="appointments" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#34c48f" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#34c48f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(76,89,104,0.16)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="appointments" stroke="#12805c" fill="url(#appointments)" />
                <Area type="monotone" dataKey="conflicts" stroke="#e66f5c" fill="#e66f5c22" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Workload distribution" subtitle="Appointments per lawyer and field consultant.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={workloadDistribution} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {workloadDistribution.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
      <ChartCard title="Peak consultation hours" subtitle="Aggregate demand by start hour for staffing decisions.">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { hour: "08:00", value: 18 },
              { hour: "09:00", value: 36 },
              { hour: "10:00", value: 42 },
              { hour: "13:00", value: 31 },
              { hour: "15:00", value: 24 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(76,89,104,0.16)" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#b9862d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
      <ChartCard title="System activity" subtitle="Audit logs and operational events stream into the API for compliance review.">
        <div className="grid gap-3 md:grid-cols-3">
          {["User role updated", "Appointment receipt generated", "Conflict scan executed"].map((event) => (
            <div key={event} className="flex items-center gap-3 rounded-lg border border-ink-100 p-4 dark:border-white/10">
              <Activity className="text-jade-700 dark:text-jade-100" size={20} />
              <span className="text-sm font-bold text-ink-900 dark:text-white">{event}</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
