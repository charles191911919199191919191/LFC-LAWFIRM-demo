import { endOfDay, endOfMonth, endOfWeek, format, startOfDay, startOfMonth, startOfWeek, subDays } from "date-fns";
import { prisma } from "../config/prisma.js";

export async function getAnalyticsSummary() {
  const now = new Date();
  const [totalAppointments, completedAppointments, pendingAppointments, conflictCount, perLawyer, lawyers, recentAppointments] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.appointment.count({ where: { status: { in: ["PENDING", "RESCHEDULE_REQUESTED"] } } }),
    prisma.appointment.count({ where: { conflictStatus: { in: ["CONFLICT", "WARNING"] } } }),
    prisma.appointment.groupBy({
      by: ["lawyerId"],
      _count: { id: true },
      where: { lawyerId: { not: null } }
    }),
    prisma.lawyer.findMany({
      include: { user: { select: { id: true, name: true } } }
    }),
    prisma.appointment.findMany({
      where: { createdAt: { gte: subDays(now, 30) } },
      select: { lawyerId: true, scheduledStart: true, createdAt: true, conflictStatus: true, status: true },
      orderBy: { createdAt: "asc" }
    })
  ]);

  const lawyerById = Object.fromEntries(lawyers.map((lawyer) => [lawyer.id, lawyer]));
  const daily = bucketAppointments(recentAppointments, (date) => format(date, "yyyy-MM-dd"));
  const weekly = bucketAppointments(recentAppointments, (date) => format(startOfWeek(date), "yyyy-MM-dd"));
  const peakHours = recentAppointments.reduce((acc, item) => {
    const date = item.scheduledStart || item.createdAt;
    const hour = format(date, "HH:00");
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  return {
    overview: {
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      completionRate: totalAppointments ? Number(((completedAppointments / totalAppointments) * 100).toFixed(2)) : 0,
      conflictCount,
      conflictFrequency: totalAppointments ? Number(((conflictCount / totalAppointments) * 100).toFixed(2)) : 0,
      dayWindow: { start: startOfDay(now), end: endOfDay(now) },
      weekWindow: { start: startOfWeek(now), end: endOfWeek(now) },
      monthWindow: { start: startOfMonth(now), end: endOfMonth(now) }
    },
    appointmentsPerLawyer: perLawyer.map((item) => ({
      lawyerId: item.lawyerId,
      lawyerName: lawyerById[item.lawyerId]?.user.name || "Unassigned",
      appointments: item._count.id
    })),
    dailyAppointments: Object.entries(daily).map(([date, count]) => ({ date, count })),
    weeklyWorkloadDistribution: Object.entries(weekly).map(([weekStart, count]) => ({ weekStart, count })),
    dailyLawyerWorkload: buildDailyLawyerWorkload(recentAppointments, lawyerById),
    peakConsultationHours: Object.entries(peakHours).map(([hour, count]) => ({ hour, count })).sort((a, b) => b.count - a.count),
    workloadDistribution: perLawyer.map((item) => ({
      lawyerId: item.lawyerId,
      lawyerName: lawyerById[item.lawyerId]?.user.name || "Unassigned",
      appointments: item._count.id
    }))
  };
}

function bucketAppointments(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item.scheduledStart || item.createdAt);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function buildDailyLawyerWorkload(items, lawyerById) {
  const grouped = items.reduce((acc, item) => {
    if (!item.lawyerId) return acc;
    const date = format(item.scheduledStart || item.createdAt, "yyyy-MM-dd");
    const key = `${date}:${item.lawyerId}`;
    acc[key] ||= {
      date,
      lawyerId: item.lawyerId,
      lawyerName: lawyerById[item.lawyerId]?.user.name || "Unassigned",
      appointments: 0,
      conflicts: 0
    };
    acc[key].appointments += 1;
    if (["CONFLICT", "WARNING"].includes(item.conflictStatus)) acc[key].conflicts += 1;
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
}
