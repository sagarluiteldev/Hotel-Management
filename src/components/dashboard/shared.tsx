"use client";

import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  CodeIcon,
  DashboardSquare01Icon,
  MoreHorizontalIcon,
  PencilIcon
} from "@hugeicons/core-free-icons";
import type { Course } from "@/lib/hotel-data";
import { cx } from "@/lib/utils";
export { cx };

export const accentClasses: Record<
  Course["accent"],
  {
    card: string;
    text: string;
    chip: string;
    icon: string;
  }
> = {
  teal: {
    card: "bg-gradient-to-br from-teal-100 via-teal-100 to-teal-200",
    text: "text-teal-950",
    chip: "bg-white/40 text-teal-900",
    icon: "text-teal-700"
  },
  indigo: {
    card: "bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300",
    text: "text-indigo-950",
    chip: "bg-white/40 text-indigo-950",
    icon: "text-indigo-700"
  },
  emerald: {
    card: "bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300",
    text: "text-emerald-950",
    chip: "bg-white/40 text-emerald-950",
    icon: "text-emerald-700"
  },
  purple: {
    card: "bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300",
    text: "text-purple-950",
    chip: "bg-white/40 text-purple-950",
    icon: "text-purple-700"
  }
};

export function Avatar({
  src,
  name,
  className
}: {
  src?: string | null;
  name?: string;
  className?: string;
}) {
  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  if (!src) {
    return (
      <div
        className={cx(
          "grid place-items-center rounded-full bg-gradient-to-br from-teal-600 via-indigo-600 to-slate-900 font-extrabold text-white shadow-sm select-none",
          className
        )}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div className={cx("relative overflow-hidden rounded-full border border-white/80 bg-slate-100 shadow-sm", className)}>
      <Image
        src={src}
        alt={name || "User avatar"}
        width={96}
        height={96}
        sizes="96px"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export function IconButton({
  children,
  label,
  active,
  onClick
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cx(
        "grid h-9 w-9 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-full border transition duration-200",
        active
          ? "border-slate-950 bg-slate-950 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
      )}
    >
      {children}
    </button>
  );
}

export function CourseIcon({ course }: { course: Course }) {
  const iconClass = cx("h-6 w-6", accentClasses[course.accent].icon);

  if (course.icon === "code") {
    return <HugeiconsIcon icon={CodeIcon} className={iconClass} />;
  }

  if (course.icon === "pen") {
    return <HugeiconsIcon icon={PencilIcon} className={iconClass} />;
  }

  if (course.icon === "book") {
    return <HugeiconsIcon icon={BookOpen01Icon} className={iconClass} />;
  }

  return <HugeiconsIcon icon={DashboardSquare01Icon} className={iconClass} />;
}

export function SectionHeading({
  icon,
  title,
  children
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="muted-surface grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-700">
          {icon}
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight truncate">{title}</h2>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">{children}</div>
    </div>
  );
}

export function CourseCard({ course }: { course: Course }) {
  const accent = accentClasses[course.accent];

  return (
    <article
      className={cx(
        "relative flex min-h-[220px] sm:min-h-[245px] flex-col justify-between overflow-hidden rounded-2xl border border-black/5 p-4 sm:p-6 shadow-inner-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-card",
        accent.card,
        accent.text
      )}
    >
      <div className="absolute -right-10 top-4 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -bottom-14 left-8 h-36 w-36 rounded-full bg-white/24 blur-2xl" />
      <div className="relative z-10 flex items-start justify-between">
        <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-white/78 shadow-sm backdrop-blur">
          <CourseIcon course={course} />
        </div>
        <button
          type="button"
          aria-label={`${course.title} menu`}
          className="rounded-full p-1 text-current/50 transition hover:bg-white/30 hover:text-current"
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} className="h-5 w-5" />
        </button>
      </div>
      <div className="relative z-10 mt-3 sm:mt-0">
        <h3 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-extrabold tracking-tight">{course.title}</h3>
        <div className="mb-4 sm:mb-7 flex flex-wrap gap-1.5 sm:gap-2">
          {course.tags.map((tag) => (
            <span key={tag} className={cx("rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold", accent.chip)}>
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-end gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-semibold opacity-85">
              <span>Readiness</span>
              <span className="font-extrabold">{course.time}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/35">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold">{course.progress}%</span>
        </div>
      </div>
    </article>
  );
}

export const RoomCard = CourseCard;
