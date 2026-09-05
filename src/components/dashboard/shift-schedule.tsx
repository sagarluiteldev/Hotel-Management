"use client";

import React, { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Note01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { formatDateKey, ScheduleItem, useDashboard } from "@/context/dashboard-context";
import { Avatar, cx, IconButton, SectionHeading } from "./shared";

export function ShiftSchedule() {
  const { schedules, selectedDate, setShowAddScheduleModal } = useDashboard();

  // 6 timeline dates centered around selectedDate (selectedDate is at index 2)
  const timelineDates = useMemo(() => {
    return Array.from({ length: 6 }).map((_, idx) => {
      return new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() - 2 + idx
      );
    });
  }, [selectedDate]);

  function getTopForTime(timeStr: string) {
    const normalized = timeStr.toLowerCase();
    if (normalized.includes("10am") || normalized.includes("10:00 am")) return 8;
    if (normalized.includes("11am") || normalized.includes("11:30 am")) return 24;
    if (normalized.includes("12am") || normalized.includes("12pm") || normalized.includes("12:00 pm")) return 40;
    if (normalized.includes("1pm") || normalized.includes("1:00 pm")) return 56;
    if (normalized.includes("2pm") || normalized.includes("2:30 pm")) return 72;
    if (normalized.includes("3pm") || normalized.includes("3:00 pm")) return 88;
    return 48;
  }

  const colorStyles: Record<ScheduleItem["color"], string> = {
    teal: "bg-teal-100 text-teal-950 border-teal-200/60",
    indigo: "bg-indigo-100 text-indigo-950 border-indigo-200/60",
    blue: "bg-blue-100 text-blue-950 border-blue-200/60",
    purple: "bg-purple-100 text-purple-950 border-purple-200/60",
    emerald: "bg-emerald-100 text-emerald-950 border-emerald-200/60"
  };

  return (
    <section className="surface-card animate-entry delay-5 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
      <SectionHeading icon={<HugeiconsIcon icon={Note01Icon} className="h-5 w-5" />} title="Reservations & Shift Schedule">
        <div className="flex items-center gap-2">
          <IconButton label="Schedule operation / check-in" onClick={() => setShowAddScheduleModal(true)}>
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
          </IconButton>
        </div>
      </SectionHeading>

      {/* Synchronized timeline container */}
      <div className="relative rounded-xl border border-slate-200/60 bg-slate-50/50 p-3 sm:p-4 overflow-x-auto app-scrollbar">
        <div className="min-w-[520px] sm:min-w-full">
          {/* 6-column grid: column borders, pills, and date headers perfectly aligned */}
          <div className="relative grid grid-cols-6 h-[175px] sm:h-[170px] border-b border-slate-200/60">
            {timelineDates.map((date, colIndex) => {
              const formattedKey = formatDateKey(date);
              const activePills = schedules.filter((s) => s.date === formattedKey);
              const isSelected = colIndex === 2;

              return (
                <div
                  key={formattedKey}
                  className={cx(
                    "relative h-full border-r border-slate-200/40 first:border-l-0 last:border-r-0",
                    isSelected && "bg-slate-100/40"
                  )}
                >
                  {/* Active Day Indicator Line (strictly centered in column 2) */}
                  {isSelected && (
                    <>
                      <div className="absolute left-1/2 -top-1 -translate-x-1/2 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-white z-20 shadow-xs" />
                      <div className="absolute left-1/2 top-1.5 -translate-x-1/2 h-[155px] w-px vertical-dashed z-0 pointer-events-none" />
                    </>
                  )}

                  {/* Event Pills for this day */}
                  <div className="relative h-full w-full">
                    {activePills.map((pill) => {
                      const topOffset = getTopForTime(pill.time);
                      return (
                        <div
                          key={pill.id}
                          style={{ top: `${topOffset}px` }}
                          className={cx(
                            "absolute left-0.5 right-0.5 sm:left-1 sm:right-1 z-10 flex flex-col justify-between gap-1 rounded-xl border p-1.5 sm:p-2 shadow-xs transition duration-200 hover:scale-[1.03] hover:shadow-md cursor-pointer",
                            colorStyles[pill.color]
                          )}
                          title={`${pill.title} (${pill.time})`}
                        >
                          <div className="min-w-0">
                            <h4 className="font-extrabold leading-tight text-[10px] sm:text-xs truncate">
                              {pill.title}
                            </h4>
                            <p className="text-[8px] sm:text-[9px] font-bold opacity-75 truncate">
                              {pill.time}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-1 pt-0.5">
                            <span className="text-[9px] font-extrabold">{pill.progress}</span>
                            <span className="flex -space-x-1.5 overflow-hidden">
                              {pill.avatars.slice(0, 2).map((avatar, index) => (
                                <Avatar
                                  key={avatar}
                                  src={avatar}
                                  name={`Duty Staff ${index + 1}`}
                                  className="h-4 w-4 sm:h-5 sm:w-5 ring-1 ring-white"
                                />
                              ))}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline Dates bottom row - shares the EXACT same 6-column grid */}
          <div className="grid grid-cols-6 pt-3 text-center text-xs font-semibold text-slate-400">
            {timelineDates.map((dateObj, colIndex) => {
              const isSelected = colIndex === 2;

              return (
                <span
                  key={dateObj.toISOString()}
                  className={cx(
                    "truncate px-1 transition",
                    isSelected ? "font-extrabold text-slate-950 scale-105" : "hover:text-slate-700"
                  )}
                >
                  <span className="block text-xs sm:text-sm font-bold">{dateObj.getDate()}</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    {dateObj.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export const ClassSchedule = ShiftSchedule;
