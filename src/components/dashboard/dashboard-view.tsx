"use client";

import React, { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BedDoubleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon
} from "@hugeicons/core-free-icons";
import { useDashboard } from "@/context/dashboard-context";
import { CourseCard, IconButton, SectionHeading } from "./shared";
import { OccupancyAnalytics } from "./occupancy-analytics";
import { CalendarCard } from "./calendar-card";
import { ShiftSchedule } from "./shift-schedule";
import { MessagesCard } from "./messages-card";

export function DashboardView() {
  const { query, coursesList } = useDashboard();

  const filteredCourses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return coursesList;
    }

    return coursesList.filter((course) =>
      [course.title, ...course.tags].join(" ").toLowerCase().includes(normalized)
    );
  }, [query, coursesList]);

  const visibleCourses = filteredCourses.length ? filteredCourses : coursesList;

  return (
    <main className="grid grid-cols-12 gap-4 sm:gap-6">
      <div className="col-span-12 flex flex-col gap-4 sm:gap-6 xl:col-span-7">
        <section className="surface-card animate-entry delay-1 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
          <SectionHeading
            icon={<HugeiconsIcon icon={BedDoubleIcon} className="h-5 w-5" />}
            title="Active Rooms & Suites"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="rounded-full bg-slate-950 px-2.5 sm:px-3 py-1 text-xs font-bold text-white">
                +{visibleCourses.length} Rooms
              </span>
              <IconButton label="Previous room">
                <HugeiconsIcon icon={ChevronLeftIcon} className="h-4 w-4" />
              </IconButton>
              <IconButton label="Next room">
                <HugeiconsIcon icon={ChevronRightIcon} className="h-4 w-4" />
              </IconButton>
              <button
                type="button"
                aria-label="Room options"
                className="rounded-full p-1.5 sm:p-2 text-slate-700 hover:bg-slate-100 transition"
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} className="h-5 w-5" />
              </button>
            </div>
          </SectionHeading>
          <div className="grid gap-3.5 sm:gap-5 md:grid-cols-2">
            {visibleCourses.slice(0, 2).map((course) => (
              <CourseCard key={course.title} course={course} />
            ))}
          </div>
        </section>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <MessagesCard />
          <CalendarCard />
        </div>
      </div>

      <div className="col-span-12 flex flex-col gap-4 sm:gap-6 xl:col-span-5">
        <OccupancyAnalytics />
        <ShiftSchedule />
      </div>
    </main>
  );
}
