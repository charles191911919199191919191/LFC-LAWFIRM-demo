# Security Notes

Implemented safeguards:

- bcrypt password hashing using 12 salt rounds.
- JWT access tokens stored in short-lived HTTP-only cookies.
- Rotating JWT refresh tokens stored in HTTP-only cookies and hashed in MySQL.
- CSRF double-submit token protection for mutating requests.
- Automatic session expiration and refresh-token reuse revocation.
- Role-based access control for client, lawyer, staff, and admin routes.
- Zod request validation and backend input sanitization.
- Prisma ORM query APIs and foreign keys to prevent SQL injection and preserve relational integrity.
- Helmet security headers for XSS and browser hardening.
- CORS allowlist with credentials support.
- API rate limiting plus login attempt limiter and brute-force lockout.
- Audit logs and activity logs for admin activity, unauthorized access, and suspicious login signals.
- Secure file upload validation with file size, MIME type, and extension checks.
- Uploaded documents are stored outside public static routing by default.

Recommended production hardening:

- Store uploaded documents in private object storage with signed URLs.
- Use a managed secrets system for `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, and database credentials.
- Enable database backups and audit logging.
- Add 2FA for staff, lawyers, and administrators if the firm requires it.
- Add monitoring such as Sentry, OpenTelemetry, or provider-native logs.
- Run dependency scanning with Dependabot, GitHub Advanced Security, or Snyk.
