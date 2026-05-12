import crypto from "node:crypto";
import { env } from "../config/env.js";

export const cookieNames = {
  access: "lfc_access",
  refresh: "lfc_refresh",
  csrf: "lfc_csrf"
};

export function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  return header.split(";").reduce((cookies, item) => {
    const [rawName, ...rest] = item.trim().split("=");
    if (!rawName) return cookies;
    cookies[decodeURIComponent(rawName)] = decodeURIComponent(rest.join("="));
    return cookies;
  }, {});
}

export function getCookie(req, name) {
  return parseCookies(req)[name];
}

function baseCookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    path: "/",
    maxAge
  };
}

export function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie(cookieNames.access, accessToken, baseCookieOptions(15 * 60 * 1000));
  res.cookie(cookieNames.refresh, refreshToken, baseCookieOptions(env.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000));
}

export function clearAuthCookies(res) {
  const options = { ...baseCookieOptions(0), maxAge: 0 };
  res.clearCookie(cookieNames.access, options);
  res.clearCookie(cookieNames.refresh, options);
}

export function issueCsrfCookie(res) {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie(cookieNames.csrf, token, {
    httpOnly: false,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000
  });
  return token;
}
