import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role?.slug,
      type: "access"
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export function signRefreshToken({ user, jti, familyId }) {
  return jwt.sign(
    {
      sub: user.id,
      jti,
      familyId,
      type: "refresh"
    },
    env.refreshTokenSecret,
    { expiresIn: `${env.refreshTokenExpiresInDays}d` }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.refreshTokenSecret);
}
