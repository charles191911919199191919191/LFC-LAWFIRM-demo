import { prisma } from "../config/prisma.js";
import { writeAuditLog } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { created, ok } from "../utils/response.js";

function resolveLawyerId(user, body) {
  if (user.role.slug === "lawyer") return user.lawyerProfile?.id;
  return body.lawyerId;
}

export const listSchedules = asyncHandler(async (req, res) => {
  const where = req.user.role.slug === "lawyer" ? { lawyerId: req.user.lawyerProfile?.id } : {};
  const schedules = await prisma.schedule.findMany({
    where,
    include: { lawyer: { include: { user: { select: { id: true, name: true } } } } },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
  });
  ok(res, { schedules });
});

export const listAvailability = asyncHandler(async (req, res) => {
  const where = req.user.role.slug === "lawyer" ? { lawyerId: req.user.lawyerProfile?.id } : {};
  const availability = await prisma.availability.findMany({
    where,
    include: { lawyer: { include: { user: { select: { id: true, name: true } } } } },
    orderBy: { startsAt: "asc" },
    take: 200
  });
  ok(res, { availability });
});

export const upsertSchedule = asyncHandler(async (req, res) => {
  const lawyerId = resolveLawyerId(req.user, req.validated.body);
  if (!lawyerId) throw new HttpError(400, "Lawyer profile is required");
  const data = { ...req.validated.body, lawyerId };
  const schedule = await prisma.schedule.upsert({
    where: {
      lawyerId_dayOfWeek_startTime: {
        lawyerId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime
      }
    },
    update: data,
    create: data
  });

  await writeAuditLog({ req, userId: req.user.id, action: "UPSERT_SCHEDULE", entity: "Schedule", entityId: schedule.id, metadata: data });
  created(res, { schedule });
});

export const createAvailability = asyncHandler(async (req, res) => {
  const lawyerId = resolveLawyerId(req.user, req.validated.body);
  if (!lawyerId) throw new HttpError(400, "Lawyer profile is required");

  const availability = await prisma.availability.create({
    data: {
      lawyerId,
      type: req.validated.body.type,
      startsAt: new Date(req.validated.body.startsAt),
      endsAt: new Date(req.validated.body.endsAt),
      reason: req.validated.body.reason,
      maxAppointments: req.validated.body.maxAppointments
    }
  });

  await writeAuditLog({ req, userId: req.user.id, action: "CREATE_AVAILABILITY", entity: "Availability", entityId: availability.id });
  created(res, { availability });
});
