import { AlertTriangle, CalendarCheck, ClipboardCheck, FileBarChart, UserRoundCheck } from "lucide-react";
import AppointmentCard from "../../components/AppointmentCard";
import ChartCard from "../../components/ChartCard";
import StatCard from "../../components/StatCard";
import { appointments, lawyers } from "../../data/mockData";

export default function StaffDashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardCheck} label="Pending requests" value="12" trend="5 received today" />
        <StatCard icon={UserRoundCheck} label="Assigned lawyers" value="9" trend="3 active teams" tone="blue" />
        <StatCard icon={AlertTriangle} label="Conflict alerts" value="4" trend="2 need reschedule" tone="coral" />
        <StatCard icon={FileBarChart} label="Reports ready" value="7" trend="Weekly export available" tone="brass" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Appointment queue" subtitle="Verify schedules, assign lawyers, and monitor conflict alerts.">
          <div className="grid gap-4">
            {appointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)}
          </div>
        </ChartCard>
        <ChartCard title="Lawyer assignment board" subtitle="Workload is updated from confirmed appointments.">
          <div className="grid gap-4">
            {lawyers.map((lawyer) => (
              <div key={lawyer.id} className="rounded-lg border border-ink-100 p-4 dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-ink-900 dark:text-white">{lawyer.name}</p>
                    <p className="text-sm text-ink-500 dark:text-ink-100">{lawyer.specialty}</p>
                  </div>
                  <CalendarCheck className="text-jade-700 dark:text-jade-100" size={20} />
                </div>
                <div className="mt-4 h-2 rounded-full bg-ink-100 dark:bg-white/10">
                  <div className="h-2 rounded-full bg-jade-400" style={{ width: `${lawyer.workload}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
