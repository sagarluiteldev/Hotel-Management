"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartBarIncreasingIcon,
  ChevronDownIcon,
  FavouriteIcon,
  PlusSignIcon,
  SlidersHorizontalIcon
} from "@hugeicons/core-free-icons";
import { useDashboard } from "@/context/dashboard-context";
import { cx, CourseIcon, IconButton, SectionHeading } from "./shared";

export function OccupancyAnalytics() {
  const {
    learningHoursView: view,
    setLearningHoursView: setView,
    setShowLogHoursModal,
    learningHoursLogs: logs,
    coursesList
  } = useDashboard();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [dropdownOpen]);

  const bars = useMemo(() => {
    if (view === "weekly") {
      return [
        { label: "Mon", value: logs["Mon"] ?? 72, accent: "teal" },
        { label: "Tue", value: logs["Tue"] ?? 81, accent: "blue" },
        { label: "Wed", value: logs["Wed"] ?? 86, accent: "teal" },
        { label: "Thu", value: logs["Thu"] ?? 92, accent: "active" },
        { label: "Fri", value: logs["Fri"] ?? 97, accent: "blue" },
        { label: "Sat", value: logs["Sat"] ?? 98, accent: "teal" },
        { label: "Sun", value: logs["Sun"] ?? 64, accent: "blue" }
      ];
    } else if (view === "monthly") {
      return [
        { label: "Jan", value: logs["Jan"] ?? 75, accent: "teal" },
        { label: "Feb", value: logs["Feb"] ?? 82, accent: "blue" },
        { label: "Mar", value: logs["Mar"] ?? 88, accent: "active" },
        { label: "Apr", value: logs["Apr"] ?? 79, accent: "blue" },
        { label: "May", value: logs["May"] ?? 84, accent: "teal" },
        { label: "Jun", value: logs["Jun"] ?? 91, accent: "blue" }
      ];
    } else {
      return [
        { label: "9 AM", value: logs["9 AM"] ?? 65, accent: "teal" },
        { label: "12 PM", value: logs["12 PM"] ?? 80, accent: "blue" },
        { label: "3 PM", value: logs["3 PM"] ?? 95, accent: "active" },
        { label: "6 PM", value: logs["6 PM"] ?? 88, accent: "teal" },
        { label: "9 PM", value: logs["9 PM"] ?? 72, accent: "blue" }
      ];
    }
  }, [view, logs]);

  // Compute dynamic axis maximum that accurately covers the maximum bar value
  const { axisMax, ticks, avgValue } = useMemo(() => {
    const rawMax = Math.max(...bars.map((b) => b.value), 1);
    const max = Math.max(100, Math.ceil(rawMax / 10) * 10);

    const t = [
      max,
      Math.round(max * 0.75),
      Math.round(max * 0.5),
      Math.round(max * 0.25),
      0
    ];

    const sum = bars.reduce((acc, b) => acc + b.value, 0);
    const avg = Math.round(sum / (bars.length || 1));

    return { axisMax: max, ticks: t, avgValue: avg };
  }, [bars]);

  return (
    <section className="surface-card animate-entry delay-2 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card xl:flex-1 flex flex-col justify-between">
      <SectionHeading
        icon={<HugeiconsIcon icon={ChartBarIncreasingIcon} className="h-5 w-5" />}
        title="Occupancy Analytics"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="muted-surface flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold transition hover:bg-slate-100 text-slate-700"
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
              <HugeiconsIcon icon={ChevronDownIcon} className="h-3.5 w-3.5" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-10 z-30 w-32 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg animate-entry">
                {(["weekly", "monthly", "daily"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setView(v);
                      setDropdownOpen(false);
                    }}
                    className={cx(
                      "block w-full rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-slate-50 transition",
                      view === v && "bg-slate-100 font-bold"
                    )}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowLogHoursModal(true)}
            aria-label="Log room occupancy"
            title="Log room occupancy"
            className="rounded-full p-1.5 sm:p-2 hover:bg-slate-100 text-slate-700 transition"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="h-5 w-5" />
          </button>
          <IconButton label="Analytics filters">
            <HugeiconsIcon icon={SlidersHorizontalIcon} className="h-4 w-4" />
          </IconButton>
        </div>
      </SectionHeading>

      {/* Chart container with dynamic synchronization */}
      <div className="relative min-h-[260px] sm:min-h-[310px] pt-3 sm:pt-4 pb-2">
        <div className="grid h-[210px] sm:h-[250px] grid-cols-[38px_1fr] sm:grid-cols-[48px_1fr] gap-2 sm:gap-3">
          {/* Dynamically synchronized Y-axis tick marks with unit indicator */}
          <div className="flex flex-col justify-between py-1 text-[10px] sm:text-xs font-bold text-slate-400 text-right pr-1 sm:pr-2">
            <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
              {view === "monthly" ? "occ %" : "rate %"}
            </span>
            {ticks.map((tick, i) => (
              <span key={i}>{tick}%</span>
            ))}
          </div>

          {/* Bar Chart Area */}
          <div className="relative flex items-end justify-between gap-1.5 sm:gap-3 px-0.5 sm:px-1">
            {/* Dynamic Average Line */}
            {avgValue > 0 && avgValue < axisMax && (
              <div
                style={{ bottom: `${(avgValue / axisMax) * 100}%` }}
                className="absolute inset-x-0 border-b border-dashed border-indigo-300/80 pointer-events-none z-10"
              >
                <span className="absolute right-0 -top-4 rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-extrabold text-indigo-700 shadow-sm">
                  Avg: {avgValue}%
                </span>
              </div>
            )}

            {/* Bar elements */}
            {bars.map((bar, index) => {
              const active = bar.accent === "active";
              const percentHeight = Math.min(100, Math.max(8, (bar.value / axisMax) * 100));

              return (
                <div
                  key={bar.label}
                  className="group relative flex min-w-0 flex-1 flex-col items-center justify-end h-full cursor-pointer z-10"
                  onMouseEnter={() => setActiveTooltip(index)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  onClick={() => setActiveTooltip(activeTooltip === index ? null : index)}
                >
                  {/* Hover tooltip */}
                  {activeTooltip === index && (
                    <div className="absolute -top-7 z-30 rounded-lg bg-slate-900 px-2 py-1 text-xs font-bold text-white shadow-md pointer-events-none whitespace-nowrap animate-entry">
                      {bar.value}% occ
                    </div>
                  )}

                  {/* Bar column */}
                  <div
                    className={cx(
                      "relative w-full max-w-[54px] rounded-t-[1.5rem] border transition-all duration-300 hover:brightness-105",
                      active
                        ? "border-slate-950 bg-slate-950 shadow-md"
                        : bar.accent === "teal"
                          ? "border-teal-200 bg-gradient-to-br from-teal-100 via-teal-100 to-teal-200 text-teal-950"
                          : "border-indigo-200 bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 text-indigo-950"
                    )}
                    style={{ height: `${percentHeight}%` }}
                  >
                    {active && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 rounded-full bg-slate-950 px-2.5 py-0.5 text-[11px] font-extrabold text-white shadow-sm whitespace-nowrap">
                        {bar.value}%
                      </div>
                    )}
                    {active && (
                      <HugeiconsIcon
                        icon={FavouriteIcon}
                        className="mx-auto mt-2.5 h-3.5 w-3.5 fill-white text-white"
                      />
                    )}
                  </div>

                  {/* X-axis day/month label */}
                  <span
                    className={cx(
                      "mt-2 truncate text-xs sm:text-sm font-semibold transition",
                      active ? "font-extrabold text-slate-950" : "text-slate-400"
                    )}
                  >
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-3 pt-2">
        {coursesList.slice(0, 3).map((course) => (
          <div
            key={course.title}
            className="panel-card flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white shadow-xs">
              <CourseIcon course={course} />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-xs font-extrabold leading-tight">{course.title}</h4>
              <p className="text-[11px] font-medium text-slate-500">{course.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const LearningHours = OccupancyAnalytics;
