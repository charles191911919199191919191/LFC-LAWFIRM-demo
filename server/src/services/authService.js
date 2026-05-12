import crypto from "node:crypto";
import { addDays, subMinutes } from "date-fns";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { writeAuditLog } from "./auditService.js";
import { writeActivityLog } from "./activityService.js";

const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MINUTES = 15;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function tokenIds() {
  return {
    jti: crypto.randomUUID(),
    familyId: crypto.randomUUID()
  };
}

async function recordLoginAttempt({ req, userId, email, success, reason }) {
  await prisma.loginAttempt.create({
    data: {
      userId,
      email: email.toLowerCase(),
      success,
      reason,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    }
  });
}

async function assertLoginAllowed({ req, email }) {
  const since = subMinutes(new Date(), ATTEMPT_WINDOW_MINUTES);
  const failedAttempts = await prisma.loginAttempt.count({
    where: {
      email: email.toLowerCase(),
      success: false,
      createdAt: { gte: since },
      OR: [{ ipAddress: req.ip }, { email: email.toLowerCase() }]
    }
  });

  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    await writeActivityLog({
      req,
      action: "BRUTE_FORCE_PROTECTION",
      summary: "Login temporarily blocked after repeated failed attempts.",
      metadata: { email: email.toLowerCase(), failedAttempts }
    });
    throw new HttpError(429, "Too many failed login attempts. Please wait before trying again.");
  }
}

export async function createSession({ req, user }) {
  const { jti, familyId } = tokenIds();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken({ user, jti, familyId });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      familyId,
      expiresAt: addDays(new Date(), env.refreshTokenExpiresInDays),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    }
  });

  return { accessToken, refreshToken };
}

export async function registerClient({ req, data, role }) {
  if (data.password !== data.confirmPassword) {
    throw new HttpError(422, "Passwords do not match");
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      passwordHash: await hashPassword(data.password),
      roleId: role.id
    },
    include: { role: true, lawyerProfile: true }
  });

  await Promise.all([
    writeAuditLog({ req, userId: user.id, action: "REGISTER", entity: "User", entityId: user.id }),
    writeActivityLog({ req, userId: user.id, action: "ACCOUNT_CREATED", summary: "Client account created through public registration." })
  ]);

  return user;
}

export async function loginUser({ req, email, password }) {
  await assertLoginAllowed({ req, email });

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { role: true, lawyerProfile: true }
  });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    await recordLoginAttempt({ req, userId: user?.id, email, success: false, reason: "INVALID_CREDENTIALS" });
    throw new HttpError(401, "Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    await recordLoginAttempt({ req, userId: user.id, email, success: false, reason: "INACTIVE_ACCOUNT" });
    throw new HttpError(403, "This account is not active");
  }

  const suspiciousSignals = await prisma.loginAttempt.count({
    where: {
      userId: user.id,
      success: false,
      createdAt: { gte: subMinutes(new Date(), ATTEMPT_WINDOW_MINUTES) }
    }
  });

  await Promise.all([
    recordLoginAttempt({ req, userId: user.id, email, success: true }),
    writeAuditLog({ req, userId: user.id, action: "LOGIN", entity: "User", entityId: user.id }),
    writeActivityLog({
      req,
      userId: user.id,
      action: suspiciousSignals > 0 ? "SUSPICIOUS_LOGIN_REVIEWED" : "LOGIN_SUCCESS",
      summary: suspiciousSignals > 0 ? "Successful login after failed attempts." : "User signed in successfully.",
      metadata: { recentFailedAttempts: suspiciousSignals }
    })
  ]);

  return user;
}

export async function rotateRefreshToken({ req, refreshToken }) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new HttpError(401, "Invalid or expired refresh token");
  }

  if (payload.type !== "refresh") {
    throw new HttpError(401, "Invalid refresh token");
  }

  const tokenHash = hashToken(refreshToken);
  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: { include: { role: true, lawyerProfile: true } } }
  });

  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date() || storedToken.user.status !== "ACTIVE") {
    await prisma.refreshToken.updateMany({
      where: { familyId: payload.familyId },
      data: { revokedAt: new Date() }
    });
    throw new HttpError(401, "Refresh session is no longer valid");
  }

  const nextJti = crypto.randomUUID();
  const accessToken = signAccessToken(storedToken.user);
  const nextRefreshToken = signRefreshToken({ user: storedToken.user, jti: nextJti, familyId: storedToken.familyId });

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        revokedAt: new Date(),
        replacedBy: hashToken(nextRefreshToken)
      }
    }),
    prisma.refreshToken.create({
      data: {
        userId: storedToken.userId,
        tokenHash: hashToken(nextRefreshToken),
        familyId: storedToken.familyId,
        expiresAt: addDays(new Date(), env.refreshTokenExpiresInDays),
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      }
    })
  ]);

  return {
    user: storedToken.user,
    accessToken,
    refreshToken: nextRefreshToken
  };
}

export async function revokeRefreshToken({ req, refreshToken, userId }) {
  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken), ...(userId && { userId }) },
      data: { revokedAt: new Date() }
    });
  }

  if (userId) {
    await writeActivityLog({ req, userId, action: "LOGOUT", summary: "User signed out and session cookies were cleared." });
  }
}
