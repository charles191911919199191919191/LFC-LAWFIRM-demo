import { prisma } from "../config/prisma.js";
import { createSession, loginUser, registerClient, revokeRefreshToken, rotateRefreshToken } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearAuthCookies, cookieNames, getCookie, issueCsrfCookie, setAuthCookies } from "../utils/cookies.js";
import { HttpError } from "../utils/httpError.js";
import { ok, created } from "../utils/response.js";
import { serializeUser } from "../utils/serializers.js";

export const register = asyncHandler(async (req, res) => {
  const data = req.validated.body;
  const role = await prisma.role.findUnique({ where: { slug: "client" } });
  if (!role) throw new HttpError(500, "Client role is not configured");

  const user = await registerClient({ req, data, role });
  const session = await createSession({ req, user });
  setAuthCookies(res, session);
  created(res, { user: serializeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await loginUser({ req, email, password });
  const session = await createSession({ req, user });
  setAuthCookies(res, session);
  ok(res, { user: serializeUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  ok(res, { user: serializeUser(req.user) });
});

export const csrf = asyncHandler(async (req, res) => {
  const csrfToken = issueCsrfCookie(res);
  ok(res, { csrfToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = getCookie(req, cookieNames.refresh);
  const session = await rotateRefreshToken({ req, refreshToken });
  setAuthCookies(res, session);
  ok(res, { user: serializeUser(session.user) });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = getCookie(req, cookieNames.refresh);
  await revokeRefreshToken({ req, refreshToken, userId: req.user?.id });
  clearAuthCookies(res);
  ok(res, { message: "Signed out securely" });
});
