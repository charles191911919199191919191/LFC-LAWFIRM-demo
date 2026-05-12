import { prisma } from "../config/prisma.js";

export async function writeActivityLog({ req, userId, action, summary, metadata = {} }) {
  return prisma.activityLog.create({
    data: {
      userId,
      action,
      summary,
      metadata,
      ipAddress: req?.ip,
      userAgent: req?.headers?.["user-agent"]
    }
  });
}
