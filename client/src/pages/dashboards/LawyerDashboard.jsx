import { AlertTriangle, BriefcaseBusiness, CalendarDays, Gauge } from "lucide-react";
import AppointmentCard from "../../components/AppointmentCard";
import CalendarGrid from "../../components/CalendarGrid";
import ChartCard from "../../components/ChartCard";
import StatCard from "../../components/StatCard";
import { appointments, timeline } from "../../data/mockData";

export default function LawyerDashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarDays} label="Today schedule" value="6" trend="2 high priority" />
        <StatCard icon={Gauge} label="Workload" value="72%" trend="Below daily max" tone="brass" />
        <StatCard icon={AlertTriangle} label="Conflict alerts" value="2" trend="1 capacity warning" tone="coral" />
        <StatCard icon={BriefcaseBusiness} label="Active matters" value="28" trend="5 follow-ups pending" tone="blue" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard title="Availability calendar" subtitle="Set availability and review scheduled consultation windows.">
          <CalendarGrid />
        </ChartCard>
        <ChartCard title="Consultation priorities" subtitle="Daily queue sorted by urgency and schedule risk.">
          <div className="grid gap-4">
            {appointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)}
          </div>
        </ChartCard>
      </div>
      <ChartCard title="Appointment timeline" subtitle="Each client request keeps an operational activity trail.">
        <div className="grid gap-3 md:grid-cols-4">
          {timeline.map((item) => (
            <div key={item.label} className="rounded-lg border border-ink-100 p-4 dark:border-white/10">
              <p className="text-xs font-extrabold uppercase text-ink-500 dark:text-ink-100">{item.time}</p>
              <p className="mt-2 text-sm font-bold text-ink-900 dark:text-white">{item.label}</p>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
