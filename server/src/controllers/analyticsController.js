import { prisma } from "../config/prisma.js";
import { getAnalyticsSummary } from "../services/analyticsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";

export const summary = asyncHandler(async (req, res) => {
  ok(res, await getAnalyticsSummary());
});

export const auditLogs = asyncHandler(async (req, res) => {
  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100
  });
  ok(res, { logs });
});
