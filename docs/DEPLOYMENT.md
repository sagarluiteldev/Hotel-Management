# Production Deployment Runbook

This guide covers deploying the Grand Haven Hotel Management System to cloud hosting platforms with managed PostgreSQL databases.

---

## 1. Cloud Database Setup

### Option A: Supabase (Recommended)
1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. Go to **Project Settings** ➔ **Database**.
3. Under **Connection string**, select **URI**.
4. Choose **Transaction Mode (Pooler)** on Port **6543** (essential for serverless deployment).
5. Copy the connection string:
   ```
   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Option B: Neon (Serverless Postgres)
1. Sign up at [neon.tech](https://neon.tech) and create a database.
2. Neon automatically provides a pooled connection string (with `-pooler` in the host).
3. Copy the pooled connection string:
   ```
   postgresql://[USER]:[PASSWORD]@ep-[NAME]-pooler.[REGION].aws.neon.tech/[DB]?sslmode=require
   ```

---

## 2. Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Grand Haven Hotel Management System - Production Ready"
   git push origin main
   ```
2. Open the [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository `Hotel-Management`.
4. Configure **Environment Variables**:
   - `DATABASE_URL`: Your pooled PostgreSQL connection string.
   - `SESSION_SECRET`: A 64-character random string (generate with `openssl rand -hex 32`).
   - `NODE_ENV`: `production`
5. Click **Deploy**.

---

## 3. Database Migration & Initialization

Once your cloud database is online, run the following commands from your local machine to apply the schema and seed initial data:

```bash
# Apply native hotel schema to cloud database
DATABASE_URL="your-cloud-database-url" npm run db:push

# Seed hotel suites, staff leads, and work orders
DATABASE_URL="your-cloud-database-url" npm run db:seed
```

---

## 4. Post-Deployment Verification

1. **Verify Health**: Visit `https://your-app.vercel.app/api/health`. Confirm `status: "healthy"` and low database latency (`< 20ms`).
2. **Verify Security Headers**:
   ```bash
   curl -I https://your-app.vercel.app/
   ```
   Check for:
   - `Strict-Transport-Security`
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Content-Security-Policy`
3. **Verify Auth Flow**: Log in with:
   - **Email**: `brenda@example.com`
   - **Password**: `learnpro`
