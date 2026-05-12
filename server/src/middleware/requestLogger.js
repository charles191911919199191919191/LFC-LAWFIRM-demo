import crypto from "node:crypto";
import { prisma } from "../config/prisma.js";

export function requestLogger(req, res, next) {
  req.requestId = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.requestId);

  res.on("finish", () => {
    if (req.path === "/health") return;
    if (res.statusCode >= 401) {
      prisma.activityLog
        .create({
          data: {
            userId: req.user?.id,
            action: res.statusCode === 401 ? "UNAUTHORIZED_ACCESS" : "REQUEST_REJECTED",
            summary: `${req.method} ${req.originalUrl} returned ${res.statusCode}`,
            metadata: { requestId: req.requestId, statusCode: res.statusCode },
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"]
          }
        })
        .catch(() => {});
    }
  });

  next();
}
