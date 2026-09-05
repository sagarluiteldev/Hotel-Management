"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Download01Icon,
  BedDoubleIcon,
  LibraryIcon,
  UserGroupIcon
} from "@hugeicons/core-free-icons";
import { resources } from "@/lib/hotel-data";
import { useDashboard } from "@/context/dashboard-context";
import { Avatar, CourseCard, SectionHeading } from "../dashboard/shared";

export function RoomsView() {
  const { query, coursesList, messagesList, setActiveChatContact } = useDashboard();

  const visibleRooms = coursesList.filter((course) =>
    course.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="grid gap-4 sm:gap-6 xl:grid-cols-[1fr_0.85fr]">
      <section className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
        <SectionHeading
          icon={<HugeiconsIcon icon={BedDoubleIcon} className="h-5 w-5" />}
          title="Room & Suite Inventory"
        >
          <span className="rounded-full bg-slate-950 px-2.5 sm:px-3 py-1 text-xs font-bold text-white">
            {visibleRooms.length} suites
          </span>
        </SectionHeading>
        <div className="grid gap-3.5 sm:gap-5 md:grid-cols-2">
          {visibleRooms.map((room) => (
            <CourseCard key={room.title} course={room} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 sm:gap-6">
        <section className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
          <SectionHeading icon={<HugeiconsIcon icon={LibraryIcon} className="h-5 w-5" />} title="Operations Manuals & SOPs" />
          <div className="space-y-2.5 sm:space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.slug}
                className="panel-card flex items-center justify-between gap-3 sm:gap-4 rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 sm:p-4 transition hover:bg-slate-50 hover:shadow-sm"
              >
                <div className="min-w-0">
                  <h3 className="truncate text-xs sm:text-sm font-extrabold">{resource.title}</h3>
                  <p className="truncate text-[11px] sm:text-xs font-semibold text-slate-500">
                    {resource.course} &bull; {resource.type}
                  </p>
                </div>
                <a
                  href={`/api/resources?file=${encodeURIComponent(resource.slug)}`}
                  download
                  className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-white text-slate-950 border border-slate-200/70 shadow-sm transition hover:bg-slate-950 hover:text-white"
                  aria-label={`Download ${resource.title}`}
                  title={`Download ${resource.title}`}
                >
                  <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
          <SectionHeading icon={<HugeiconsIcon icon={UserGroupIcon} className="h-5 w-5" />} title="On-Duty Staff & Leads" />
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {messagesList.slice(0, 4).map((message) => (
              <div
                key={message.name}
                onClick={() => setActiveChatContact(message.name)}
                className="rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 sm:p-4 cursor-pointer hover:bg-slate-100/80 hover:shadow-sm transition"
              >
                <Avatar src={message.avatar} name={message.name} className="mb-2.5 sm:mb-3 h-10 w-10 sm:h-11 sm:w-11" />
                <h3 className="truncate text-xs sm:text-sm font-extrabold">{message.name}</h3>
                <p className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  On Duty
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export const ClassesView = RoomsView;
