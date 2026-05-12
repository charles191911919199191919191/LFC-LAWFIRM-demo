import { Save, ShieldCheck, Users } from "lucide-react";
import toast from "react-hot-toast";
import ChartCard from "../components/ChartCard";

export default function Settings() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-extrabold uppercase text-jade-700 dark:text-jade-100">Settings</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink-900 dark:text-white">System settings and user management</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ChartCard title="Security policy" subtitle="Session, rate limit, and notification defaults.">
          <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); toast.success("Settings saved"); }}>
            {[
              ["Session expiration", "8 hours"],
              ["Daily appointment capacity", "8"],
              ["Conflict alert threshold", "80% workload"]
            ].map(([label, value]) => (
              <label key={label} className="grid gap-2 text-sm font-bold text-ink-700 dark:text-white">
                {label}
                <input defaultValue={value} className="focus-ring rounded-lg border border-ink-100 px-3 py-3 dark:border-white/10 dark:bg-ink-950" />
              </label>
            ))}
            <button type="submit" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-ink-900 px-4 py-3 text-sm font-extrabold text-white dark:bg-jade-400 dark:text-ink-950">
              <Save size={16} /> Save settings
            </button>
          </form>
        </ChartCard>
        <ChartCard title="Users and roles" subtitle="Administrators can manage client, staff, lawyer, and admin permissions.">
          <div className="grid gap-3">
            {[
              ["Elena Rivera", "Lawyer", "Active"],
              ["Nora Valdez", "Staff", "Active"],
              ["Mina Santos", "Client", "Verified"],
              ["Admin Operations", "Admin", "Protected"]
            ].map(([name, role, status]) => (
              <div key={name} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-100 p-4 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-jade-100 text-jade-800 dark:bg-jade-400/15 dark:text-jade-100">
                    {role === "Admin" ? <ShieldCheck size={18} /> : <Users size={18} />}
                  </div>
                  <div>
                    <p className="font-extrabold text-ink-900 dark:text-white">{name}</p>
                    <p className="text-sm text-ink-500 dark:text-ink-100">{role}</p>
                  </div>
                </div>
                <span className="rounded-lg bg-ink-50 px-2.5 py-1 text-xs font-extrabold text-ink-600 dark:bg-white/10 dark:text-white">{status}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
