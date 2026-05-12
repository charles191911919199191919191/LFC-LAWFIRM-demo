import { prisma } from "../config/prisma.js";

export async function writeAuditLog({ req, userId, action, entity, entityId, metadata = {} }) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      metadata,
      ipAddress: req?.ip,
      userAgent: req?.headers?.["user-agent"]
    }
  });
}
