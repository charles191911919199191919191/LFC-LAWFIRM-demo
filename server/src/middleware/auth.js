import { prisma } from "../config/prisma.js";
import { cookieNames, getCookie } from "../utils/cookies.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { HttpError } from "../utils/httpError.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    const bearerToken = header?.startsWith("Bearer ") ? header.slice(7) : null;
    const token = bearerToken || getCookie(req, cookieNames.access);

    if (!token) {
      throw new HttpError(401, "Authentication token required");
    }

    const payload = verifyAccessToken(token);
    if (payload.type !== "access") {
      throw new HttpError(401, "Invalid token type");
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true, lawyerProfile: true }
    });

    if (!user || user.status !== "ACTIVE") {
      throw new HttpError(401, "Invalid or inactive user");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new HttpError(401, "Invalid or expired token"));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    const role = req.user?.role?.slug;
    if (!roles.includes(role)) {
      return next(new HttpError(403, "You do not have permission to perform this action"));
    }
    return next();
  };
}
