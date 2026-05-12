import { addDays, addMinutes, getDay, isBefore, parseISO, setHours, setMinutes } from "date-fns";
import { prisma } from "../config/prisma.js";

export function classifyPriority({ consultationType = "", description = "" }) {
  const content = `${consultationType} ${description}`.toLowerCase();
  if (/(emergency|urgent|court deadline|deadline|urgent filing|filing|injunction|hearing)/.test(content)) {
    return "HIGH";
  }
  if (/(ongoing|processing|follow-up|follow up|review|case update|compliance)/.test(content)) {
    return "MEDIUM";
  }
  return "REGULAR";
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function appointmentRange(start, end) {
  const startDate = typeof start === "string" ? parseISO(start) : start;
  const endDate = end ? (typeof end === "string" ? parseISO(end) : end) : addMinutes(startDate, 60);
  return { startDate, endDate };
}

async function isSlotAvailable({ lawyerId, startDate, endDate, appointmentId }) {
  const overlap = await prisma.appointment.count({
    where: {
      lawyerId,
      id: appointmentId ? { not: appointmentId } : undefined,
      status: { in: ["SCHEDULED", "APPROVED"] },
      scheduledStart: { lt: endDate },
      scheduledEnd: { gt: startDate }
    }
  });
  return overlap === 0;
}

export async function recommendAlternativeSchedules({ lawyerId, start, end, appointmentId, limit = 5 }) {
  if (!lawyerId || !start) return [];
  const { startDate, endDate } = appointmentRange(start, end);
  const durationMinutes = Math.max(30, Math.round((endDate.getTime() - startDate.getTime()) / 60000));
  const recommendations = [];

  const schedules = await prisma.schedule.findMany({
    where: { lawyerId, isAvailable: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
  });

  for (let offset = 0; offset < 21 && recommendations.length < limit; offset += 1) {
    const day = addDays(startDate, offset);
    const daySchedules = schedules.filter((schedule) => schedule.dayOfWeek === getDay(day));

    for (const schedule of daySchedules) {
      const scheduleStartMinutes = timeToMinutes(schedule.startTime);
      const scheduleEndMinutes = timeToMinutes(schedule.endTime);
      for (let cursor = scheduleStartMinutes; cursor + durationMinutes <= scheduleEndMinutes && recommendations.length < limit; cursor += 30) {
        let candidateStart = setMinutes(setHours(day, Math.floor(cursor / 60)), cursor % 60);
        const candidateEnd = addMinutes(candidateStart, durationMinutes);

        if (isBefore(candidateStart, new Date())) continue;

        const blocked = await prisma.availability.count({
          where: {
            lawyerId,
            type: { in: ["UNAVAILABLE", "RESERVED"] },
            startsAt: { lt: candidateEnd },
            endsAt: { gt: candidateStart }
          }
        });

        if (blocked > 0) continue;

        const dailyCount = await prisma.appointment.count({
          where: {
            lawyerId,
            status: { in: ["SCHEDULED", "APPROVED", "COMPLETED"] },
            scheduledStart: {
              gte: new Date(candidateStart.getFullYear(), candidateStart.getMonth(), candidateStart.getDate()),
              lt: new Date(candidateStart.getFullYear(), candidateStart.getMonth(), candidateStart.getDate() + 1)
            }
          }
        });

        if (dailyCount >= schedule.maxAppointments) continue;
        if (await isSlotAvailable({ lawyerId, startDate: candidateStart, endDate: candidateEnd, appointmentId })) {
          recommendations.push({
            startsAt: candidateStart,
            endsAt: candidateEnd,
            reason: dailyCount >= Math.ceil(schedule.maxAppointments * 0.8) ? "Available with workload watch" : "Available"
          });
        }
      }
    }
  }

  return recommendations;
}

export async function detectSchedulingConflicts({ lawyerId, start, end, appointmentId, clientId, consultationType }) {
  if (!lawyerId || !start) {
    return {
      status: "PENDING_ASSIGNMENT",
      conflicts: [],
      warnings: ["No lawyer assigned yet. Staff review required."],
      recommendations: []
    };
  }

  const { startDate, endDate } = appointmentRange(start, end);
  const dayOfWeek = getDay(startDate);
  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

  const [schedule, overlappingAppointments, sameDayCount, historicalCount, duplicateRequests, availabilityBlocks] = await Promise.all([
    prisma.schedule.findFirst({
      where: {
        lawyerId,
        dayOfWeek,
        isAvailable: true,
        startTime: { lte: `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}` },
        endTime: { gte: `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}` }
      }
    }),
    prisma.appointment.findMany({
      where: {
        lawyerId,
        id: appointmentId ? { not: appointmentId } : undefined,
        status: { in: ["SCHEDULED", "APPROVED"] },
        scheduledStart: { lt: endDate },
        scheduledEnd: { gt: startDate }
      },
      select: { id: true, subject: true, scheduledStart: true, scheduledEnd: true }
    }),
    prisma.appointment.count({
      where: {
        lawyerId,
        status: { in: ["SCHEDULED", "APPROVED", "COMPLETED"] },
        scheduledStart: {
          gte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
          lt: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1)
        }
      }
    }),
    prisma.appointment.count({
      where: {
        lawyerId,
        status: { in: ["SCHEDULED", "APPROVED", "COMPLETED"] },
        scheduledStart: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.appointment.findMany({
      where: {
        id: appointmentId ? { not: appointmentId } : undefined,
        clientId,
        lawyerId,
        consultationType,
        status: { notIn: ["CANCELLED", "REJECTED", "COMPLETED"] },
        preferredStart: { gte: addMinutes(startDate, -15), lte: addMinutes(startDate, 15) },
        preferredEnd: { gte: addMinutes(endDate, -15), lte: addMinutes(endDate, 15) }
      },
      select: { id: true, subject: true, preferredStart: true, status: true }
    }),
    prisma.availability.findMany({
      where: {
        lawyerId,
        type: { in: ["UNAVAILABLE", "RESERVED"] },
        startsAt: { lt: endDate },
        endsAt: { gt: startDate }
      },
      select: { id: true, type: true, reason: true, startsAt: true, endsAt: true }
    })
  ]);

  const conflicts = [];
  const warnings = [];

  if (!schedule || startMinutes < timeToMinutes(schedule.startTime) || endMinutes > timeToMinutes(schedule.endTime)) {
    conflicts.push({
      type: "UNAVAILABLE_LAWYER",
      message: "Selected lawyer is unavailable during this window."
    });
  }

  if (availabilityBlocks.length > 0) {
    conflicts.push({
      type: "UNAVAILABLE_LAWYER",
      message: "Selected lawyer has a reserved or unavailable block during this window.",
      availabilityBlocks
    });
  }

  if (overlappingAppointments.length > 0) {
    conflicts.push({
      type: "DOUBLE_BOOKING",
      message: "The requested window overlaps with an existing confirmed appointment.",
      appointments: overlappingAppointments
    });
  }

  if (duplicateRequests.length > 0) {
    conflicts.push({
      type: "DUPLICATE_REQUEST",
      message: "A similar appointment request already exists for this client, lawyer, and time window.",
      appointments: duplicateRequests
    });
  }

  const maxAppointments = schedule?.maxAppointments || 8;
  if (sameDayCount >= maxAppointments) {
    warnings.push("Daily workload capacity has been reached for this lawyer.");
  } else if (sameDayCount >= Math.ceil(maxAppointments * 0.8)) {
    warnings.push("Lawyer workload is approaching daily capacity.");
  }

  const dailyAverage = historicalCount / 30;
  if (sameDayCount > Math.max(4, dailyAverage * 1.4)) {
    warnings.push("Historical patterns suggest possible appointment congestion for this day.");
  }

  const status = conflicts.length ? "CONFLICT" : warnings.length ? "WARNING" : "CLEAR";
  const recommendations = status === "CLEAR"
    ? []
    : await recommendAlternativeSchedules({ lawyerId, start: startDate, end: endDate, appointmentId });

  return {
    status,
    conflicts,
    warnings,
    recommendations,
    metrics: {
      sameDayCount,
      maxAppointments,
      thirtyDayDailyAverage: Number(dailyAverage.toFixed(2))
    }
  };
}
