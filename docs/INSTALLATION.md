# Installation Guide

## Requirements

- Node.js 20+
- npm 10+
- MySQL 8-compatible database

## Local Setup

```bash
npm install
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Set `DATABASE_URL`, `JWT_SECRET`, and `REFRESH_TOKEN_SECRET` in `server/.env`.

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Frontend: `http://127.0.0.1:5173`  
Backend: `http://localhost:5000/api`

## Seed Accounts

All seeded accounts use:

```text
Password123!
```

- Admin: `admin@lfcfirm.com`
- Staff: `staff@lfcfirm.com`
- Lawyer: `attorney.rivera@lfcfirm.com`
- Client: `client@demo.com`
