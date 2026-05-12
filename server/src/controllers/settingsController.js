import { prisma } from "../config/prisma.js";
import { writeAuditLog } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";

export const listSettings = asyncHandler(async (req, res) => {
  const settings = await prisma.systemSetting.findMany({ orderBy: { key: "asc" } });
  ok(res, { settings });
});

export const updateSetting = asyncHandler(async (req, res) => {
  const { key, value } = req.validated.body;
  const setting = await prisma.systemSetting.upsert({
    where: { key },
    create: { key, value, updatedById: req.user.id },
    update: { value, updatedById: req.user.id }
  });

  await writeAuditLog({ req, userId: req.user.id, action: "UPDATE_SETTING", entity: "SystemSetting", entityId: setting.id, metadata: { key } });
  ok(res, { setting });
});
