"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  StarIcon,
  UserIcon,
  Video01Icon
} from "@hugeicons/core-free-icons";
import { staff } from "@/lib/hotel-data";
import { useDashboard } from "@/context/dashboard-context";
import { Avatar, SectionHeading } from "../dashboard/shared";

export function StaffView() {
  const { query, setBookingTeacher } = useDashboard();

  const visibleStaff = staff.filter((member) =>
    [member.name, member.title, member.specialty].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="grid gap-4 sm:gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <section className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
        <SectionHeading icon={<HugeiconsIcon icon={UserIcon} className="h-5 w-5" />} title="Hotel Staff & Department Leads">
          <span className="rounded-full bg-slate-950 px-2.5 sm:px-3 py-1 text-xs font-bold text-white">
            {visibleStaff.length} leads
          </span>
        </SectionHeading>
        <div className="grid gap-3.5 sm:gap-5 md:grid-cols-2">
          {visibleStaff.map((member) => (
            <article key={member.name} className="panel-card rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 sm:p-5 transition hover:bg-slate-50 hover:shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar src={member.avatar} name={member.name} className="h-11 w-11 sm:h-14 sm:w-14" />
                  <div className="min-w-0">
                    <h3 className="truncate text-base sm:text-lg font-extrabold">{member.name}</h3>
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-500">{member.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-white px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-extrabold text-slate-950 shadow-sm">
                  <HugeiconsIcon icon={StarIcon} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                  {member.rating}
                </div>
              </div>
              <p className="mb-4 sm:mb-5 min-h-[50px] sm:min-h-[72px] text-xs sm:text-sm font-medium leading-relaxed sm:leading-6 text-slate-500">{member.bio}</p>
              <div className="mb-4 sm:mb-5 flex flex-wrap gap-1.5 sm:gap-2">
                <span className="rounded-full bg-teal-100 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-teal-900">
                  {member.specialty}
                </span>
                <span className="rounded-full bg-indigo-100 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-indigo-900">
                  {member.nextSession}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBookingTeacher(member)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold text-white transition hover:bg-slate-800"
              >
                <HugeiconsIcon icon={Video01Icon} className="h-4 w-4" />
                Schedule Briefing
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
        <SectionHeading icon={<HugeiconsIcon icon={Calendar03Icon} className="h-5 w-5" />} title="Upcoming Shift Briefings" />
        <div className="space-y-3 sm:space-y-3.5">
          {staff.slice(0, 4).map((member) => {
            const memberAgendas: Record<string, string> = {
              "Arlene McCoy": "VIP Penthouse Turnover & Linens Inspection",
              "Jerome Bell": "Chiller Plant HVAC Maintenance & Boiler Check",
              "Annette Pena": "Grand Ballroom Catering & Wine Cellar Inventory",
              "Brenda Clarence": "Presidential Suite Check-in & Keycard Dispatch"
            };
            const agenda = memberAgendas[member.name] || `${member.specialty} Shift Briefing`;

            return (
              <div key={member.name} className="rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 sm:p-4 transition hover:bg-slate-50 hover:shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={member.avatar} name={member.name} className="h-10 w-10 shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold truncate">{member.name}</h3>
                      <p className="text-xs font-medium text-slate-500 truncate">{member.specialty}</p>
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    On Duty
                  </span>
                </div>

                <div className="mb-3 rounded-lg bg-white/80 p-2.5 border border-slate-200/40">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Duty Topic</span>
                  <p className="text-xs font-semibold text-slate-800 truncate">{agenda}</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-500">{member.nextSession}</span>
                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800"
                  >
                    <HugeiconsIcon icon={Video01Icon} className="h-3.5 w-3.5" />
                    Join Briefing
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </main>
  );
}

export const TeachersView = StaffView;
