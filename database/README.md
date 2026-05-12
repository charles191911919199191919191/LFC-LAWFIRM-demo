# Database

Prisma is the source of truth for schema generation and migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

`database/schema.sql` is a readable MySQL snapshot for hosting review, DBAs, and manual inspection. In production, run Prisma migrations rather than manually editing tables.

Recommended managed databases:

- PlanetScale MySQL
- Railway MySQL
- Amazon RDS MySQL
- DigitalOcean Managed MySQL
