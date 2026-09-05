"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ChartBarIncreasingIcon,
  CreditCardIcon,
  CrownIcon,
  SparklesIcon
} from "@hugeicons/core-free-icons";
import { useDashboard } from "@/context/dashboard-context";
import { Avatar, SectionHeading, cx } from "../dashboard/shared";

export function ProfileView() {
  const { currentUser, coursesList, tasks, learningHoursLogs } = useDashboard();

  const totalClasses = coursesList.length;
  const hourValues = Object.values(learningHoursLogs).filter((h): h is number => typeof h === "number");
  const avgOccupancy = hourValues.length > 0
    ? Math.round(hourValues.reduce((acc, h) => acc + h, 0) / hourValues.length)
    : 84;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "submitted").length;

  return (
    <main className="grid gap-4 sm:gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
        <div className="mb-5 sm:mb-6 flex items-center gap-3.5 sm:gap-5">
          <Avatar src={currentUser.avatarUrl} name={currentUser.name} className="h-16 w-16 sm:h-24 sm:w-24 text-lg sm:text-2xl" />
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">{currentUser.name}</h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">Hotel Operations Director</p>
            <div className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-indigo-200/50 bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 px-2.5 sm:px-3 py-1 text-xs font-extrabold text-indigo-950 shadow-sm">
              <HugeiconsIcon icon={CrownIcon} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {currentUser.membership === "PRO" ? "Senior Property Lead" : currentUser.membership === "TEAM" ? "Department Supervisor" : "Duty Manager"}
            </div>
          </div>
        </div>
        <p className="mb-5 sm:mb-6 text-xs sm:text-sm font-medium leading-relaxed sm:leading-6 text-slate-500">
          {currentUser.bio || "Overseeing luxury guest experiences, suite readiness, turnover operations, and departmental workflows across Grand Haven Hotel & Suites."}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            [`${totalClasses}`, "Suites Managed"],
            [`${avgOccupancy}%`, "Avg Occupancy"],
            [`${completedTasks}/${totalTasks}`, "Work Orders"]
          ].map(([value, label]) => (
            <div key={label} className="rounded-xl border border-slate-200/60 bg-slate-50/70 p-2.5 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-extrabold">{value}</div>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-500">{label}</div>
            </div>
          ))}
        </div>
        <Link
          href="/settings"
          className="mt-5 sm:mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold text-white transition hover:bg-slate-800 shadow-sm"
        >
          Edit Profile
          <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
        </Link>
      </section>

      <div className="grid gap-4 sm:gap-6">
        <section className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
          <SectionHeading icon={<HugeiconsIcon icon={SparklesIcon} className="h-5 w-5" />} title="Operational Clearance" />
          <div className="rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4 sm:p-6 text-white border border-slate-800 shadow-sm">
            <div className="mb-5 sm:mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold">Executive Tier</h3>
                <p className="text-xs sm:text-sm font-semibold text-white/65">Grand Haven Luxury Suites</p>
              </div>
              <HugeiconsIcon icon={CreditCardIcon} className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div className="grid gap-2 sm:gap-3 sm:grid-cols-3">
              {["Master Key Dispatch", "Housekeeping Audits", "F&B Oversight"].map((feature) => (
                <span key={feature} className="rounded-lg bg-white/10 px-2.5 sm:px-3 py-2 text-center text-xs font-bold">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
          <SectionHeading icon={<HugeiconsIcon icon={ChartBarIncreasingIcon} className="h-5 w-5" />} title="Suite Readiness & Turnover" />
          <div className="space-y-4">
            {coursesList.map((course) => (
              <div key={course.title}>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                  <span>{course.title}</span>
                  <span className="font-bold">{course.progress}% Ready</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cx(
                      "h-full rounded-full transition-all duration-500",
                      course.progress >= 100 ? "bg-emerald-500" : "bg-slate-950"
                    )}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
