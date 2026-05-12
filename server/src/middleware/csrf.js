import { cookieNames, getCookie, issueCsrfCookie } from "../utils/cookies.js";
import { HttpError } from "../utils/httpError.js";

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfProtection(req, res, next) {
  if (safeMethods.has(req.method)) {
    if (!getCookie(req, cookieNames.csrf)) {
      issueCsrfCookie(res);
    }
    return next();
  }

  if (req.path === "/api/auth/csrf") {
    return next();
  }

  const cookieToken = getCookie(req, cookieNames.csrf);
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(new HttpError(403, "CSRF validation failed"));
  }

  return next();
}
