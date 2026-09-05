# Grand Haven Hotel & Suites - Operations Management System

<div align="center">

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Security Rating](https://img.shields.io/badge/Security-10%2F10-brightgreen?style=for-the-badge)

**A luxury, 5-star Hotel Management System (HMS) built for high-touch hospitality operations, room inventory management, staff department coordination, housekeeping work orders, and real-time occupancy analytics.**

[Live Health Status](#-system-health--monitoring) • [Quickstart](#-quickstart--local-setup) • [Architecture](#-system-architecture) • [API Reference](#-api-endpoints-reference) • [Production Deployment](#-production-deployment-guide)

</div>

---

## 🌟 Executive Overview

**Grand Haven Hotel & Suites Operations Management System** is a full-stack, enterprise-grade hospitality platform built with Next.js 16 (App Router), React 19, TypeScript, Prisma ORM, and PostgreSQL. Designed specifically for luxury hotel general managers, front-office directors, and department leads, it streamlines front-of-house guest experiences and back-of-house engineering routines through an intuitive, aesthetic dashboard.

### Core Value Pillars
- 🏨 **Room & Suite Inventory**: Track suites, penthouses, and private villas with live pricing, status indicators, and amenity tags.
- 👥 **Department Personnel & Staffing**: Manage duty rosters, guest ratings, staff specializations, and on-duty department leads.
- 🛠️ **Housekeeping & Engineering Work Orders**: Priority-based task tracking with status transitions (`TODO` ➔ `IN_PROGRESS` ➔ `SUBMITTED` ➔ `COMPLETED`).
- 📊 **Real-Time Occupancy Analytics**: Interactive occupancy percentage trends, day-by-day guest logs, and dynamic metrics.
- 📱 **Engineered Mobile Experience**: Custom mobile slide-out navigation aside drawer with tailored spring physics and top-right quick profile & theme controls.
- 🔒 **Enterprise-Grade Security (10/10)**: Strict CSP and HSTS headers, sliding-window rate limiting, CSRF origin verification, and state-revocable HMAC-signed HTTP-only sessions.

---

## 🏗️ System Architecture

```
                                  +---------------------------------------+
                                  |            CLIENT VIEWPORTS           |
                                  |  Desktop / Tablet / Mobile Responsive |
                                  +---------------------------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |          NEXT.JS MIDDLEWARE           |
                                  |  - Session Verification               |
                                  |  - Route Protection & 307 Redirects   |
                                  |  - CSRF Origin / Referer Validation   |
                                  +---------------------------------------+
                                                      |
                                     +----------------+----------------+
                                     |                                 |
                                     v                                 v
                     +-------------------------------+ +-------------------------------+
                     |         APP ROUTER UI         | |        API ROUTE HANDLERS     |
                     |  / (Operations Command)       | |  /api/auth/* (Rate Limited)   |
                     |  /rooms (Inventory & Suites)  | |  /api/rooms (Suite Inventory) |
                     |  /staff (Personnel & Shifts)  | |  /api/staff (Roster & Leads)  |
                     |  /work-orders (Operations)    | |  /api/work-orders (Orders)    |
                     |  /profile & /settings         | |  /api/occupancy & /health     |
                     +-------------------------------+ +-------------------------------+
                                     |                                 |
                                     +----------------+----------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |              PRISMA ORM               |
                                  |   Singleton Client + Pool Management  |
                                  +---------------------------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |          POSTGRESQL DATABASE          |
                                  |  Rooms, Staff, WorkOrders, Logs,      |
                                  |  Reservations, Users, ChatMessages    |
                                  +---------------------------------------+
```

---

## 🔒 Security & Authentication Architecture

The application has been audited and hardened according to OWASP Top 10 guidelines:

| Feature | Implementation Details |
| :--- | :--- |
| **Password Hashing** | Passwords hashed using **bcrypt** with cost factor 12. Enforces minimum 8 characters with alphanumeric requirements. |
| **Session Cookies** | Signed with **HMAC-SHA256** using a 64-character secret. Stored in `HttpOnly`, `SameSite=Lax`, `Secure` (production) cookies. |
| **Session Revocation** | Database `tokenVersion` pattern. When a user logs out or resets credentials, `tokenVersion` increments in PostgreSQL, instantly invalidating sessions on all devices. |
| **Timing Attack Defense** | Token signature verification uses `crypto.timingSafeEqual` for constant-time cryptographic comparison. |
| **Rate Limiting** | Sliding-window in-memory limiter guards `/api/auth/signin` (5 attempts/min) and `/api/auth/signup` (3 attempts/10 min) against brute-force attacks. Returns HTTP 429 with `Retry-After`. |
| **CSRF Defense** | Middleware verifies the `Origin` header against `Host` on all mutating HTTP methods (`POST`, `PATCH`, `PUT`, `DELETE`). Cross-origin requests are blocked with `403 Forbidden`. |
| **HTTP Headers** | Production responses enforce `Strict-Transport-Security` (HSTS), `X-Frame-Options: DENY` (anti-clickjacking), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a strict `Content-Security-Policy`. |
| **Serverless File Storage** | Upload handler features automatic fallback to base64 data URIs on read-only/ephemeral serverless hosts (Vercel, AWS Lambda), preventing disk write crashes. |

---

## 🗄️ Database Schema (Entity Relationships)

The database schema is defined in [`prisma/schema.prisma`](prisma/schema.prisma) using native hotel domain models:

```mermaid
erDiagram
    User ||--o{ WorkOrder : "assigned_to"
    User ||--o{ OccupancyLog : "logged_by"
    User ||--o{ Reservation : "created_by"
    User ||--o{ ChatMessage : "sends"
    User ||--o{ Submission : "uploads"
    Room ||--o{ WorkOrder : "located_in"
    Room ||--o{ Reservation : "booked_in"
    Room ||--o{ Resource : "sops"
    WorkOrder ||--o{ Submission : "attachments"

    User {
        string id PK
        string name
        string email UK
        string passwordHash
        enum role "ADMIN | MANAGER | STAFF | GUEST"
        enum membership "FREE | PRO | TEAM"
        int tokenVersion
        datetime createdAt
    }

    Room {
        string id PK
        string title
        string roomNumber
        string category
        string pricePerNight
        enum status "AVAILABLE | OCCUPIED | MAINTENANCE | CLEANING"
        int progress
        string accent
        string[] tags
    }

    Staff {
        string id PK
        string name
        string title
        string department
        float rating
        enum shiftStatus "ON_DUTY | OFF_DUTY | ON_LEAVE"
        string specialty
        string nextShift
    }

    WorkOrder {
        string id PK
        string title
        string description
        enum status "TODO | IN_PROGRESS | SUBMITTED | COMPLETED"
        enum priority "LOW | MEDIUM | HIGH | URGENT"
        datetime dueAt
    }

    OccupancyLog {
        string id PK
        string dayLabel
        float hours "Occupancy %"
        datetime loggedAt
    }

    Reservation {
        string id PK
        string guestName
        string guestEmail
        enum status "CONFIRMED | CHECKED_IN | CHECKED_OUT | CANCELLED"
        datetime checkIn
        datetime checkOut
    }
```

---

## 📡 API Endpoints Reference

All application endpoints are protected by session authentication unless marked public.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Live system diagnostics, DB ping latency, uptime, and status. |
| `POST` | `/api/auth/signin` | Public (Rate Limited) | Authenticates credentials, sets signed HTTP-only cookie. |
| `POST` | `/api/auth/signup` | Public (Rate Limited) | Registers new manager account and provisions starter hotel data. |
| `POST` | `/api/auth/signout` | Authenticated | Clears session cookie and increments `tokenVersion` in PostgreSQL. |
| `GET` | `/api/rooms` | Authenticated | Fetches hotel room and suite inventory with live occupancy progress. |
| `GET` | `/api/staff` | Authenticated | Retrieves department staff leads, duty rosters, and guest ratings. |
| `GET` | `/api/work-orders` | Authenticated | Returns active housekeeping and maintenance tasks with due dates. |
| `PATCH` | `/api/work-orders` | Authenticated | Updates work order status (`TODO`, `IN_PROGRESS`, `SUBMITTED`). |
| `GET` | `/api/occupancy` | Authenticated | Fetches weekly day-by-day occupancy percentage analytics. |
| `POST` | `/api/occupancy` | Authenticated | Records new daily occupancy rate and updates room progress. |
| `GET` | `/api/profile` | Authenticated | Returns manager profile, account role, and operational metrics. |
| `PATCH` | `/api/profile` | Authenticated | Updates profile bio, phone number, and account settings. |
| `POST` | `/api/submissions` | Authenticated | Uploads attachments/files for work orders (serverless safe). |
| `GET` | `/api/resources` | Authenticated | Downloads hotel standard operating procedure (SOP) text guides. |

---

## 📱 Engineered Mobile UX

The dashboard features an adaptive, mobile-first responsive architecture:
1. **Slide-Out `<aside>` Drawer**:
   - Slides from the left with a spring physics easing curve: `cubic-bezier(0.25, 1.15, 0.45, 1.02)` over `0.42s`.
   - Closes smoothly back offscreen with `cubic-bezier(0.4, 0, 0.2, 1)` over `0.32s`.
   - Synchronized backdrop blur overlay (`bg-slate-950/40 backdrop-blur-xs`).
2. **Top-Right Quick Controls**:
   - On mobile viewports (`< md`), the top navbar prominently displays the **Theme Toggle** (Light / Dark mode pill) and the **Profile Avatar Button**.
3. **Integrated Notifications Drawer**:
   - Notifications have been moved into the mobile aside drawer with an explicit **"Notifications"** item, active unread counter badge, and an expandable alerts list to prevent header clutter.

---

## 🚀 Quickstart / Local Setup

### Prerequisites
- Node.js 18.18+ (Node 20+ recommended)
- PostgreSQL database (local or cloud)
- npm or pnpm / yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sagarluiteldev/Hotel-Management.git
cd Hotel-Management
npm install
```

### 2. Environment Variables Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Edit `.env` and provide your database connection string and session secret:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/learning_dashboard?schema=public"
SESSION_SECRET="your-secure-random-64-char-hex-string"
```
*(Generate a session secret using: `openssl rand -hex 32`)*

### 3. Initialize & Seed Database
Synchronize the Prisma schema and populate the database with hotel suites, department leads, and work orders:
```bash
# Push hotel schema to PostgreSQL
npm run db:push

# Seed hotel operational data
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port displayed in terminal) in your browser.

### 5. Default Test Account Credentials
| Field | Value |
| :--- | :--- |
| **Email** | `brenda@example.com` |
| **Password** | `learnpro` |
| **Role** | Senior Hotel Operations Manager |

---

## 🚢 Production Deployment Guide

### Deploying to Vercel + Cloud PostgreSQL (Supabase / Neon)

#### 1. Cloud PostgreSQL Setup
Get a free PostgreSQL instance from [Supabase](https://supabase.com) or [Neon](https://neon.tech).
- **For Serverless (Vercel)**: Copy the **pooled connection string** (Port **6543** on Supabase with `?pgbouncer=true`, or the `-pooler` URL on Neon) to prevent connection exhaustion.

#### 2. Configure Vercel Project
1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import `Hotel-Management`.
3. Add the following **Environment Variables**:
   - `DATABASE_URL`: Your cloud PostgreSQL pooled connection string.
   - `SESSION_SECRET`: A 64-character hex key (`openssl rand -hex 32`).
   - `NODE_ENV`: Set to `production`.

#### 3. Initialize Cloud Database
From your local terminal, apply the schema and seed your cloud database:
```bash
DATABASE_URL="your-cloud-database-url" npm run db:push
DATABASE_URL="your-cloud-database-url" npm run db:seed
```

#### 4. Deploy & Verify
Trigger the deployment on Vercel. Once deployed, verify:
- Health check: `https://your-domain.vercel.app/api/health`
- Secure Sign In: `https://your-domain.vercel.app/signin`

---

## 🩺 System Health & Monitoring

A dedicated health-check endpoint is available at `/api/health`:

```bash
curl -s http://localhost:3000/api/health
```

Sample response:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-05T20:45:00.000Z",
  "uptimeSeconds": 1420,
  "environment": "production",
  "database": {
    "status": "connected",
    "latencyMs": 3
  },
  "responseTimeMs": 4
}
```

This endpoint is compatible with uptime monitors such as UptimeRobot, BetterStack, Datadog, or AWS Route53 health checks.

---

## 📁 Repository Structure

```
Hotel-Management/
├── docs/                        # Comprehensive architecture & API docs
│   ├── ARCHITECTURE.md          # In-depth system architecture & components
│   ├── API.md                   # Complete REST API specification
│   ├── DEPLOYMENT.md            # Production deployment runbook
│   └── SECURITY.md              # Security policies & defense implementations
├── prisma/
│   ├── schema.prisma            # Native hotel models & relations
│   └── seed.mjs                 # 5-star hotel operational data seed script
├── public/                      # Static assets & icons
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # Secure API Route Handlers
│   │   │   ├── auth/            # Signin, Signup, Signout routes
│   │   │   ├── health/          # Live health check & DB latency
│   │   │   ├── occupancy/       # Occupancy analytics endpoints
│   │   │   ├── profile/         # User profile endpoints
│   │   │   ├── resources/       # SOP download handlers
│   │   │   ├── rooms/           # Room & suite inventory API
│   │   │   ├── staff/           # Staff roster & leads API
│   │   │   ├── submissions/     # Work order attachment uploads
│   │   │   └── work-orders/     # Operations work order endpoints
│   │   ├── rooms/               # Rooms & Suites management page
│   │   ├── staff/               # Staff & department leads page
│   │   ├── work-orders/         # Operations work orders page
│   │   ├── settings/            # System & property settings page
│   │   ├── profile/             # Hotel operations profile page
│   │   ├── signin/              # Authentication login view
│   │   ├── signup/              # Account registration view
│   │   ├── layout.tsx           # Root layout & font configurations
│   │   ├── page.tsx             # Root operations command center
│   │   └── globals.css          # Design system, themes & keyframes
│   ├── components/
│   │   ├── dashboard/           # Dashboard cards, charts & schedules
│   │   ├── layout/              # AppShell & responsive navigation aside
│   │   ├── rooms/               # Rooms & suite management components
│   │   ├── staff/               # Staff roster & leads components
│   │   └── work-orders/         # Housekeeping & work order components
│   ├── context/
│   │   └── dashboard-context.tsx# Global state management & hooks
│   ├── lib/
│   │   ├── auth.ts              # HMAC session signing & token revocation
│   │   ├── hotel-data.ts        # Domain models, fixtures & aliases
│   │   ├── prisma.ts            # Prisma client singleton & pooling
│   │   ├── rate-limiter.ts      # Sliding-window rate limiter
│   │   └── utils.ts             # Styling & class merger utilities
│   └── middleware.ts            # Route guarding, redirects & CSRF check
├── next.config.ts               # Next.js config with HTTP security headers
├── package.json                 # Project dependencies & scripts
├── tailwind.config.js           # Tailored luxury palette & shadows
└── tsconfig.json                # TypeScript strict configuration
```

---

## 📄 License & Credits

Built with precision by **[Sagar Luitel](https://github.com/sagarluiteldev)** for **Grand Haven Hotel & Suites**.

Licensed under the [MIT License](LICENSE).
