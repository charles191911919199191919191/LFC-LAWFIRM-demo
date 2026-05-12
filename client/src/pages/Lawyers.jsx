import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { lawyers } from "../data/mockData";

export default function Lawyers() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase text-jade-700 dark:text-jade-100">Lawyers</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-ink-900 dark:text-white sm:text-5xl">Counsel profiles with availability, workload, and specialty context.</h1>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {lawyers.map((lawyer) => (
            <article key={lawyer.id} className="rounded-lg border border-ink-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="grid h-20 w-20 place-items-center rounded-lg bg-ink-900 text-2xl font-extrabold text-brass-300 dark:bg-white dark:text-ink-900">{lawyer.initials}</div>
              <h2 className="mt-5 text-xl font-extrabold text-ink-900 dark:text-white">{lawyer.name}</h2>
              <p className="mt-1 text-sm font-semibold text-jade-700 dark:text-jade-100">{lawyer.specialty}</p>
              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-ink-500 dark:text-ink-100">Availability</dt><dd className="font-bold text-ink-900 dark:text-white">{lawyer.availability}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-500 dark:text-ink-100">Rating</dt><dd className="font-bold text-ink-900 dark:text-white">{lawyer.rating}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-500 dark:text-ink-100">Workload</dt><dd className="font-bold text-ink-900 dark:text-white">{lawyer.workload}%</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
