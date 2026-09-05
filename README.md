# Learning Dashboard

A Next.js, React, Tailwind CSS, Prisma, and PostgreSQL learning dashboard based on the supplied visual design.

## Run Locally

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

The app works in demo mode when `DATABASE_URL` is not configured. Add a PostgreSQL URL and run `npm run prisma:migrate` to persist users, courses, tasks, and submissions.
# Hotel-Management
