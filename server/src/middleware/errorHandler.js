import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { env } from "../config/env.js";

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      issues: error.issues
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({ success: false, message: "A record with this value already exists" });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    ...(env.nodeEnv !== "production" && { stack: error.stack, details: error.details })
  });
}
