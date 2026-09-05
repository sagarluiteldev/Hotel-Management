"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  CircleIcon,
  LockIcon,
  Mail01Icon,
  Notification03Icon,
  Shield01Icon,
  UserSettings01Icon
} from "@hugeicons/core-free-icons";
import { useDashboard } from "@/context/dashboard-context";
import { SectionHeading } from "../dashboard/shared";

export function SettingsView() {
  const { currentUser, saveSettings } = useDashboard();
  const [notifications, setNotifications] = useState({
    classes: true,
    tasks: true,
    mentor: false
  });

  return (
    <main className="grid gap-4 sm:gap-6 xl:grid-cols-[1fr_0.85fr]">
      <form onSubmit={saveSettings} className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
        <SectionHeading icon={<HugeiconsIcon icon={UserSettings01Icon} className="h-5 w-5" />} title="Hotel Management Profile" />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Full name</span>
            <input
              name="name"
              defaultValue={currentUser.name}
              className="app-input"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Email</span>
            <input
              name="email"
              type="email"
              defaultValue={currentUser.email}
              className="app-input"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Phone</span>
            <input
              name="phone"
              defaultValue={currentUser.phone}
              className="app-input"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Timezone</span>
            <select className="app-select">
              <option>Asia/Kathmandu</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
            </select>
          </label>
        </div>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Bio</span>
          <textarea
            name="bio"
            rows={4}
            defaultValue={currentUser.bio}
            className="app-input resize-none"
          />
        </label>
        <button
          type="submit"
          className="mt-5 rounded-xl bg-slate-950 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 shadow-sm"
        >
          Save Changes
        </button>
      </form>

      <div className="grid gap-4 sm:gap-6">
        <section className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
          <SectionHeading icon={<HugeiconsIcon icon={Shield01Icon} className="h-5 w-5" />} title="Security & Authentication" />
          <div className="space-y-2.5 sm:space-y-3">
            {[
              {
                label: "Account Password",
                value: "Encrypted with salted bcrypt hash",
                icon: LockIcon,
                status: "active",
                badge: "Active"
              },
              {
                label: "Session Integrity",
                value: "HMAC-SHA256 signed HTTP-only cookie",
                icon: Shield01Icon,
                status: "active",
                badge: "Secure"
              },
              {
                label: "Primary Email",
                value: currentUser.email || "Registered account email",
                icon: Mail01Icon,
                status: "active",
                badge: "Primary"
              },
              {
                label: "Two-Factor Auth (2FA)",
                value: "Authenticator app verification",
                icon: CheckmarkCircle02Icon,
                status: "pending",
                badge: "Coming Soon"
              }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 sm:p-4 transition hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-white border border-slate-200/70 shadow-sm">
                    <HugeiconsIcon icon={item.icon} className="h-4 w-4 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">{item.label}</h3>
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-500">{item.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span
                    className={
                      item.status === "active"
                        ? "rounded-full bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-emerald-700"
                        : "rounded-full bg-slate-200/70 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-slate-600"
                    }
                  >
                    {item.badge}
                  </span>
                  <HugeiconsIcon
                    icon={CircleIcon}
                    className={
                      item.status === "active"
                        ? "h-2 w-2 sm:h-2.5 sm:w-2.5 fill-emerald-500 text-emerald-500"
                        : "h-2 w-2 sm:h-2.5 sm:w-2.5 fill-slate-400 text-slate-400"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
          <SectionHeading icon={<HugeiconsIcon icon={Notification03Icon} className="h-5 w-5" />} title="Hotel Operations Alerts" />
          <div className="space-y-2.5 sm:space-y-3">
            {[
              ["classes", "VIP Arrival & Check-In Alerts"],
              ["tasks", "Urgent Housekeeping & Maintenance Escalations"],
              ["mentor", "Department Staff & Shift Handover Comms"]
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 sm:p-4 text-xs sm:text-sm font-extrabold transition hover:bg-slate-50"
              >
                {label}
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={() =>
                    setNotifications((current) => ({
                      ...current,
                      [key]: !current[key as keyof typeof notifications]
                    }))
                  }
                  className="h-4 w-4 sm:h-5 sm:w-5 rounded-md border-slate-300 text-slate-950 focus:ring-slate-950"
                />
              </label>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
