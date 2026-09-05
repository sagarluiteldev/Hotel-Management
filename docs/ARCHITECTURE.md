# System Architecture & Component Design

## Overview
The **Grand Haven Hotel Management System (HMS)** is architected around a hybrid server-client model leveraging Next.js 16 App Router, React 19 concurrent features, Prisma ORM, and PostgreSQL.

---

## 1. Architectural Layers

```
+-------------------------------------------------------------------------+
|                              PRESENTATION                               |
|  - React 19 Client Components (Interactive Views, Forms, Modals)        |
|  - Server-Rendered Layouts & Shell Wrapper                              |
|  - Tailwind CSS + CSS Custom Properties (Theme Switcher: Light/Dark)    |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                            APPLICATION STATE                            |
|  - DashboardContext: Global operational state, active filters, toast    |
|  - Optimistic UI Updates: Status updates, logs, instant chat feedback   |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                         EDGE & MIDDLEWARE LAYER                         |
|  - Next.js Middleware: Route Protection, Legacy 307 Path Forwarding     |
|  - CSRF Origin / Referer Validation for Mutating Operations             |
|  - Session Cookie Extraction & Pre-Validation                           |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                           API & BUSINESS LOGIC                          |
|  - Next.js Route Handlers (/api/*)                                      |
|  - Sliding-Window Rate Limiting (In-Memory IP Bucket)                   |
|  - Zod Input Parsing & Sanitization                                     |
|  - Server-Side Session Token Verification & Revocation Tracking         |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                                DATA LAYER                               |
|  - Prisma ORM Singleton Client (globalThis connection reuse)            |
|  - PostgreSQL Database (Native Hotel Schema)                            |
|  - Connection Pooling Support (PgBouncer / Transaction Mode)             |
+-------------------------------------------------------------------------+
```

---

## 2. Component Hierarchy

- **Root Layout (`src/app/layout.tsx`)**
  - Font provider (Plus Jakarta Sans)
  - Theme initialization
  - **DashboardProvider (`src/context/dashboard-context.tsx`)**
    - **AppShell (`src/components/layout/app-shell.tsx`)**
      - Top Navbar:
        - Mobile hamburger button + Crown branding logo
        - Desktop navigation pills
        - Theme toggle (Light / Dark mode)
        - Profile quick view modal
      - Page Content Area:
        - **DashboardView (`src/components/dashboard/dashboard-view.tsx`)**
          - Stats overview cards (Active suites, on-duty leads, occupancy %, open work orders)
          - Occupancy Analytics chart (`OccupancyAnalytics`)
          - Shift Schedule roster (`ShiftSchedule`)
          - Calendar card (`CalendarCard`)
          - Staff messages & chat drawer (`MessagesCard`)
        - **RoomsView (`src/components/rooms/rooms-view.tsx`)**
          - Room cards, floor indicators, pricing per night, amenities tags
          - Filter tabs (All, Penthouse, Suite, Villa, Executive)
        - **StaffView (`src/components/staff/staff-view.tsx`)**
          - Department leads, duty statuses, shift rosters, 1-on-1 dispatch modal
        - **WorkOrdersView (`src/components/work-orders/work-orders-view.tsx`)**
          - Task status columns (`TODO`, `IN_PROGRESS`, `SUBMITTED`), priority pills, attachments
        - **SettingsView & ProfileView**
      - Mobile Aside Drawer:
        - Slide-out navigation menu with tailored spring easing curve
        - Integrated expandable Notifications list
        - Pinned user profile pill

---

## 3. State Management Flow

1. **Hydration & Initial Fetch**:
   - `DashboardProvider` initializes from `src/lib/hotel-data.ts` fixtures for instant rendering without layout shift.
   - Concurrently fetches live data from `/api/rooms`, `/api/staff`, `/api/work-orders`, and `/api/occupancy`.
2. **Optimistic Updates**:
   - When a manager changes a work order status (e.g. from `todo` to `progress`), the UI state updates immediately for zero-latency user experience.
   - Asynchronous `PATCH /api/work-orders` persists the change to PostgreSQL in the background. If an error occurs, state rolls back with an alert toast.
3. **Session State**:
   - Auth status and user profile are loaded via `/api/profile`.
   - Signout triggers `/api/auth/signout`, increments `tokenVersion`, wipes the cookie, and resets client state.
