"use client";

import React, { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, ChevronLeftIcon, ChevronRightIcon } from "@hugeicons/core-free-icons";
import { formatDateKey, useDashboard } from "@/context/dashboard-context";
import { cx, IconButton, SectionHeading } from "./shared";

export function CalendarCard() {
  const {
    selectedDate,
    setSelectedDate,
    viewedDate,
    setViewedDate,
    schedules
  } = useDashboard();

  const today = useMemo(() => new Date(), []);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = useMemo(() => {
    const currentYear = today.getFullYear();
    return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  }, [today]);

  const year = viewedDate.getFullYear();
  const month = viewedDate.getMonth();

  const startDayOfWeek = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);
  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
  const daysArray = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const scheduleDotsMap = useMemo(() => {
    const map: Record<string, { teal: boolean; indigo: boolean }> = {};
    schedules.forEach((item) => {
      if (!map[item.date]) {
        map[item.date] = { teal: false, indigo: false };
      }
      if (item.color === "teal" || item.color === "emerald") {
        map[item.date].teal = true;
      } else {
        map[item.date].indigo = true;
      }
    });
    return map;
  }, [schedules]);

  return (
    <section className="surface-card animate-entry delay-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
      <SectionHeading icon={<HugeiconsIcon icon={Calendar03Icon} className="h-5 w-5" />} title="Reservations Calendar">
        <div className="flex items-center gap-2">
          <IconButton
            label="Previous month"
            onClick={() => setViewedDate(new Date(year, month - 1, 1))}
          >
            <HugeiconsIcon icon={ChevronLeftIcon} className="h-4 w-4" />
          </IconButton>

          <div className="flex items-center gap-1.5">
            <select
              value={month}
              onChange={(e) => setViewedDate(new Date(year, parseInt(e.target.value), 1))}
              className="bg-slate-50 hover:bg-slate-100 text-xs font-bold rounded-lg py-1.5 px-2.5 outline-none border border-slate-200/80 transition text-slate-700 cursor-pointer shadow-sm"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx}>
                  {m.slice(0, 3)}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setViewedDate(new Date(parseInt(e.target.value), month, 1))}
              className="bg-slate-50 hover:bg-slate-100 text-xs font-bold rounded-lg py-1.5 px-2.5 outline-none border border-slate-200/80 transition text-slate-700 cursor-pointer shadow-sm"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <IconButton
            label="Next month"
            onClick={() => setViewedDate(new Date(year, month + 1, 1))}
          >
            <HugeiconsIcon icon={ChevronRightIcon} className="h-4 w-4" />
          </IconButton>
        </div>
      </SectionHeading>

      <div className="grid grid-cols-7 gap-y-1.5 sm:gap-y-2 text-center text-xs sm:text-sm">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="pb-1.5 sm:pb-2 font-semibold text-slate-400">
            {day}
          </div>
        ))}
        {Array.from({ length: startDayOfWeek }).map((_, emptyIdx) => (
          <span key={`empty-${emptyIdx}`} className="mx-auto h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-50/10" />
        ))}
        {daysArray.map((d) => {
          const currentDate = new Date(year, month, d);
          const formatted = formatDateKey(currentDate);

          const isSelected =
            selectedDate.getDate() === d &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;

          const isToday =
            today.getDate() === d &&
            today.getMonth() === month &&
            today.getFullYear() === year;

          const dots = scheduleDotsMap[formatted];
          const hasTeal = dots?.teal;
          const hasIndigo = dots?.indigo;

          return (
            <button
              type="button"
              key={d}
              onClick={() => setSelectedDate(currentDate)}
              className={cx(
                "relative mx-auto grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full font-semibold transition hover:scale-105",
                isSelected
                  ? "bg-slate-950 text-white ring-2 ring-offset-2 ring-slate-950 shadow-md"
                  : isToday
                    ? "border-2 border-slate-950 text-slate-950 font-bold bg-slate-50"
                    : hasTeal
                      ? "bg-teal-100 text-teal-950 hover:bg-teal-200"
                      : hasIndigo
                        ? "bg-indigo-100 text-indigo-950 hover:bg-indigo-200"
                        : "text-slate-700 hover:bg-slate-100"
              )}
            >
              {d}
              {!isSelected && (hasTeal || hasIndigo) && (
                <span className="absolute bottom-1 flex gap-0.5">
                  {hasTeal && <span className="h-1 w-1 rounded-full bg-teal-500" />}
                  {hasIndigo && <span className="h-1 w-1 rounded-full bg-indigo-500" />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
