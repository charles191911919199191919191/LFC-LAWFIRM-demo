import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";

export const listLawyers = asyncHandler(async (req, res) => {
  const lawyers = await prisma.lawyer.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      schedules: true,
      _count: { select: { appointments: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  ok(res, { lawyers });
});

export const getLawyerAvailability = asyncHandler(async (req, res) => {
  const lawyer = await prisma.lawyer.findUnique({
    where: { id: req.params.id },
    include: { user: { select: { id: true, name: true } }, schedules: true, availability: true }
  });
  if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });
  ok(res, { lawyer });
});
