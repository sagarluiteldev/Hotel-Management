"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BedDoubleIcon,
  Cancel01Icon,
  CrownIcon,
  Home01Icon,
  Logout01Icon,
  Menu01Icon,
  MoonIcon,
  Note01Icon,
  Notification03Icon,
  PlusSignIcon,
  Search01Icon,
  SentIcon,
  Settings01Icon,
  SlidersHorizontalIcon,
  Sun01Icon,
  UserIcon,
  UserSettings01Icon
} from "@hugeicons/core-free-icons";
import { avatarUrls, teachers } from "@/lib/hotel-data";
import { formatDateKey, useDashboard } from "@/context/dashboard-context";
import { Avatar } from "@/components/dashboard/shared";

import { cx } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", icon: Home01Icon },
  { label: "Rooms & Suites", href: "/rooms", icon: BedDoubleIcon },
  { label: "Hotel Staff", href: "/staff", icon: UserIcon },
  { label: "Work Orders", href: "/work-orders", icon: Note01Icon },
  { label: "Settings", href: "/settings", icon: Settings01Icon }
] as const;

type RouteMeta = { kicker: string; title: string; search: string };

const routeHeaders: Record<string, RouteMeta> = {
  "/": {
    kicker: "Welcome back",
    title: "Grand Haven Hotel Operations",
    search: "Search rooms, guests, or staff..."
  },
  "/rooms": {
    kicker: "Inventory & Stays",
    title: "Rooms & Suites Management",
    search: "Search room or suite..."
  },
  "/classes": {
    kicker: "Inventory & Stays",
    title: "Rooms & Suites Management",
    search: "Search room or suite..."
  },
  "/staff": {
    kicker: "Hotel Personnel",
    title: "Staff & Department Leads",
    search: "Search staff or department..."
  },
  "/teachers": {
    kicker: "Hotel Personnel",
    title: "Staff & Department Leads",
    search: "Search staff or department..."
  },
  "/work-orders": {
    kicker: "Daily Operations",
    title: "Housekeeping & Work Orders",
    search: "Search work orders..."
  },
  "/tasks": {
    kicker: "Daily Operations",
    title: "Housekeeping & Work Orders",
    search: "Search work orders..."
  },
  "/settings": {
    kicker: "Settings",
    title: "Property & System Settings",
    search: "Search setting..."
  },
  "/profile": {
    kicker: "Operations Profile",
    title: "Hotel Operations Director",
    search: "Search logs & activity..."
  }
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    theme,
    setTheme,
    currentUser,
    query,
    setQuery,
    toast,
    showToast,
    profileOpen,
    setProfileOpen,
    signOut,
    activeChatContact,
    setActiveChatContact,
    chatHistories,
    handleSendMessage,
    isTyping,
    messagesList,
    showAddScheduleModal,
    setShowAddScheduleModal,
    handleAddSchedule,
    showLogHoursModal,
    setShowLogHoursModal,
    handleLogHours,
    bookingTeacher,
    setBookingTeacher,
    handleBook1on1,
    coursesList,
    selectedDate
  } = useDashboard();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: "n1",
      title: "VIP Arrival Alert",
      desc: "Penthouse 401 ambassador requested early check-in at 1:30 PM",
      time: "10m ago",
      read: false
    },
    {
      id: "n2",
      title: "Work Order Escalation",
      desc: "Deluxe Ocean Suite 204 AC inspection is marked priority",
      time: "2h ago",
      read: false
    },
    {
      id: "n3",
      title: "Occupancy Milestone",
      desc: "Property reached 98% weekend occupancy across all suites!",
      time: "1d ago",
      read: true
    }
  ]);

  const [mobileAsideOpen, setMobileAsideOpen] = useState(false);
  const [mobileNotificationsExpanded, setMobileNotificationsExpanded] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileAsideOpen(false);
    setMobileNotificationsExpanded(false);
  }

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotificationsCount = notificationsList.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setProfileOpen(false);
        setShowAddScheduleModal(false);
        setShowLogHoursModal(false);
        setBookingTeacher(null);
        setActiveChatContact(null);
        setMobileAsideOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    setProfileOpen,
    setShowAddScheduleModal,
    setShowLogHoursModal,
    setBookingTeacher,
    setActiveChatContact
  ]);

  // If user is on /signin or /signup, render without the dashboard shell
  if (pathname === "/signin" || pathname === "/signup") {
    return <>{children}</>;
  }

  const currentMeta = routeHeaders[pathname] || {
    kicker: "Welcome back",
    title: "Hotel Operations Dashboard",
    search: "Search..."
  };

  const dynamicTitle =
    pathname === "/profile" ? currentUser.name : currentMeta.title;
  const dynamicKicker =
    pathname === "/"
      ? `${currentMeta.kicker}, ${currentUser.name.split(" ")[0]}`
      : currentMeta.kicker;

  return (
    <div
      className={cx(
        "min-h-screen bg-[var(--app-bg)] text-slate-950 transition-colors",
        theme === "dark" && "theme-dark"
      )}
    >
      <div className="dashboard-shell min-h-screen w-full bg-white p-3.5 sm:p-6 lg:p-8 pb-8 sm:pb-10">
        {/* Top Navbar */}
        <nav className="mb-6 sm:mb-8 lg:mb-10 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="order-1 flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileAsideOpen}
              onClick={() => setMobileAsideOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-950 transition hover:bg-slate-100 md:hidden shadow-xs"
            >
              <HugeiconsIcon icon={Menu01Icon} className="h-5 w-5" />
            </button>
            <Link href="/" className="flex w-fit items-center gap-2.5 sm:gap-3">
              <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full border-2 border-slate-950 bg-appBg">
                <HugeiconsIcon icon={CrownIcon} className="h-5 w-5 sm:h-7 sm:w-7" />
              </span>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight">Grand Haven</span>
            </Link>
          </div>

          <div className="muted-surface app-scrollbar order-3 hidden md:flex w-full xl:order-2 xl:w-auto max-w-full gap-2 overflow-x-auto rounded-full bg-slate-50 p-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "flex shrink-0 items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition",
                    active
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-200/70 hover:text-slate-950"
                  )}
                >
                  <HugeiconsIcon icon={Icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="order-2 flex items-center justify-end gap-2 sm:gap-3 xl:order-3">
            <div className="relative hidden md:block" ref={notificationRef}>
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-950 transition hover:bg-slate-100"
              >
                <span className="relative">
                  <HugeiconsIcon icon={Notification03Icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </span>
              </button>

              {notificationsOpen && (
                <div className="surface-card absolute right-0 top-12 sm:top-14 z-50 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl animate-entry">
                  <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">Notifications</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })))
                        }
                        className="text-xs font-bold text-slate-900 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notificationsList.length === 0 ? (
                      <p className="py-6 text-center text-xs font-semibold text-slate-400">
                        No notifications yet.
                      </p>
                    ) : (
                      notificationsList.map((item) => (
                        <div
                          key={item.id}
                          onClick={() =>
                            setNotificationsList((prev) =>
                              prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                            )
                          }
                          className={cx(
                            "cursor-pointer rounded-xl p-3 text-left transition hover:bg-slate-50",
                            !item.read ? "bg-slate-50/80 border-l-2 border-slate-950" : "opacity-75"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900">{item.title}</span>
                            <span className="text-[10px] font-medium text-slate-400">{item.time}</span>
                          </div>
                          <p className="mt-0.5 text-xs font-medium text-slate-600 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="muted-surface flex rounded-full border border-slate-200 bg-slate-100 p-0.5 sm:p-1">
              <button
                type="button"
                aria-label="Light mode"
                onClick={() => setTheme("light")}
                className={cx(
                  "grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full transition",
                  theme === "light"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                )}
              >
                <HugeiconsIcon icon={Sun01Icon} className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                type="button"
                aria-label="Dark mode"
                onClick={() => setTheme("dark")}
                className={cx(
                  "grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full transition",
                  theme === "dark"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                )}
              >
                <HugeiconsIcon icon={MoonIcon} className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                aria-label="Open profile quick view"
                onClick={() => setProfileOpen((open) => !open)}
                className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center overflow-hidden rounded-full border border-slate-200 bg-white p-0.5 sm:p-1 transition hover:scale-105"
              >
                <Avatar
                  src={currentUser.avatarUrl}
                  name={currentUser.name}
                  className="h-full w-full text-xs font-bold"
                />
              </button>

              {profileOpen && (
                <div className="profile-menu absolute right-0 top-16 z-30 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl animate-entry">
                  <div className="mb-4 flex items-center gap-3">
                    <Avatar
                      src={currentUser.avatarUrl}
                      name={currentUser.name}
                      className="h-12 w-12 shrink-0 text-base font-bold"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-slate-900">{currentUser.name || "My Account"}</h3>
                      <p className="truncate text-xs font-medium text-slate-500">{currentUser.email || "Pro learning member"}</p>
                    </div>
                  </div>

                  <div className="mb-4 rounded-xl border border-indigo-200/60 bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 p-4 text-indigo-950 shadow-sm">
                    <div className="mb-1 flex items-center gap-2 text-sm font-bold">
                      <HugeiconsIcon icon={CrownIcon} className="h-4 w-4" />
                      5-Star Property Portal
                    </div>
                    <p className="text-xs font-medium text-indigo-950/80">4 suites active &bull; 4 department leads on duty</p>
                  </div>

                  <div className="grid gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold hover:bg-slate-50 transition"
                    >
                      <HugeiconsIcon icon={UserSettings01Icon} className="h-4 w-4" />
                      Profile quick view
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold hover:bg-slate-50 transition"
                    >
                      <HugeiconsIcon icon={Settings01Icon} className="h-4 w-4" />
                      Account settings
                    </Link>
                    <button
                      type="button"
                      onClick={signOut}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <HugeiconsIcon icon={Logout01Icon} className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Section Header */}
        <header className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="muted-text mb-1 text-sm sm:text-base lg:text-lg font-medium text-slate-500">{dynamicKicker}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{dynamicTitle}</h1>
              <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-indigo-200/50 bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-semibold text-indigo-950 shadow-sm">
                <HugeiconsIcon icon={CrownIcon} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Senior Lead
              </span>
            </div>
          </div>
          <div className="flex w-full items-center gap-2.5 sm:gap-3 sm:w-auto">
            <label className="relative flex-1 sm:w-72 md:w-80">
              <HugeiconsIcon
                icon={Search01Icon}
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={currentMeta.search}
                className="muted-surface w-full rounded-xl border border-slate-200/80 bg-slate-50 py-2 sm:py-2 pl-10 pr-4 text-sm font-medium outline-none transition focus:bg-white focus:border-slate-900 focus:shadow-xs"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                showToast("Filters applied");
              }}
              aria-label="Filter"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
            >
              <HugeiconsIcon icon={SlidersHorizontalIcon} className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </div>

      {/* Mobile Navigation Aside Drawer & Backdrop */}
      <div
        onClick={() => setMobileAsideOpen(false)}
        className={cx(
          "mobile-aside-backdrop fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs md:hidden",
          mobileAsideOpen && "is-open"
        )}
        aria-hidden="true"
      />
      <aside
        aria-label="Mobile Navigation Menu"
        aria-hidden={!mobileAsideOpen}
        className={cx(
          "mobile-aside-drawer surface-card fixed inset-y-0 left-0 z-50 flex w-72 sm:w-80 max-w-[85vw] flex-col justify-between border-r border-slate-200/80 bg-white p-5 shadow-2xl md:hidden",
          mobileAsideOpen && "is-open"
        )}
      >
            <div className="flex-1 overflow-y-auto pr-1 app-scrollbar">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-slate-950 bg-appBg">
                    <HugeiconsIcon icon={CrownIcon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight text-slate-950">Grand Haven</h2>
                    <p className="text-[11px] font-medium text-slate-500">Hotel Management</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setMobileAsideOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-950 transition"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Navigation
                </p>
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileAsideOpen(false)}
                      className={cx(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                        active
                          ? "bg-slate-950 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                      )}
                    >
                      <HugeiconsIcon icon={Icon} className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Notifications Item in Mobile Aside */}
              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Alerts & Updates
                </p>
                <button
                  type="button"
                  onClick={() => setMobileNotificationsExpanded((prev) => !prev)}
                  className={cx(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    mobileNotificationsExpanded
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="relative">
                      <HugeiconsIcon icon={Notification03Icon} className="h-5 w-5" />
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white" />
                      )}
                    </span>
                    <span>Notifications</span>
                  </div>
                  {unreadNotificationsCount > 0 ? (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                      {unreadNotificationsCount} new
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-slate-400">All caught up</span>
                  )}
                </button>

                {/* Expandable Notifications List */}
                {mobileNotificationsExpanded && (
                  <div className="mt-2 space-y-2 rounded-2xl bg-slate-50 p-3 border border-slate-200/60 animate-entry">
                    <div className="flex items-center justify-between px-1 pb-1">
                      <span className="text-xs font-bold text-slate-800">Recent Alerts</span>
                      {unreadNotificationsCount > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })))
                          }
                          className="text-[11px] font-semibold text-indigo-600 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    {notificationsList.map((item) => (
                      <div
                        key={item.id}
                        className={cx(
                          "rounded-xl p-2.5 text-left text-xs transition border",
                          item.read
                            ? "border-transparent bg-white/70 text-slate-600"
                            : "border-indigo-100 bg-white font-medium text-slate-900 shadow-2xs"
                        )}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold text-slate-900 leading-tight">{item.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 leading-normal">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 shrink-0">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <Avatar src={currentUser.avatarUrl} name={currentUser.name} className="h-10 w-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-950">{currentUser.name}</p>
                  <p className="truncate text-[11px] text-slate-500">{currentUser.email}</p>
                </div>
              </div>
            </div>
          </aside>

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-soft animate-entry text-center max-w-[90vw]">
          {toast}
        </div>
      )}

      {/* Floating Chat Drawer UI */}
      {activeChatContact && (
        <>
          <div
            onClick={() => setActiveChatContact(null)}
            className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-xs sm:hidden animate-entry"
          />
          <div className="surface-card fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex h-[480px] sm:h-[420px] w-full sm:w-[340px] flex-col rounded-t-3xl sm:rounded-2xl border border-slate-200/80 bg-white shadow-2xl overflow-hidden animate-entry">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20">
                <Image
                  src={
                    messagesList.find((m) => m.name === activeChatContact)?.avatar ||
                    teachers.find((t) => t.name === activeChatContact)?.avatar ||
                    avatarUrls.arlene
                  }
                  alt={activeChatContact}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold truncate">{activeChatContact}</h4>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveChatContact(null)}
              className="text-slate-400 hover:text-white transition p-1"
              aria-label="Close chat"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 rotate-45" />
            </button>
          </div>

          <div className="app-scrollbar flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {(chatHistories[activeChatContact] || []).map((msg, idx) => (
              <div
                key={idx}
                className={cx(
                  "max-w-[80%] rounded-xl px-3.5 py-2 text-xs font-semibold leading-relaxed shadow-xs",
                  msg.sender === "user"
                    ? "ml-auto bg-slate-950 text-white rounded-br-sm"
                    : "bg-white text-slate-800 border border-slate-200/60 rounded-bl-sm"
                )}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1 bg-white border border-slate-200/60 px-3 py-2 rounded-xl rounded-tl-sm w-fit self-start shadow-xs">
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem("chatMessage") as HTMLInputElement;
              if (!input.value.trim()) return;
              handleSendMessage(input.value);
              input.value = "";
            }}
            className="flex border-t border-slate-100 p-3 bg-white"
          >
            <input
              name="chatMessage"
              placeholder="Type a message..."
              autoComplete="off"
              className="flex-1 bg-slate-50 border border-slate-200/60 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:border-slate-900 transition"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="ml-2 grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800 shadow-sm"
            >
              <HugeiconsIcon icon={SentIcon} className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </>
      )}

      {/* Add Schedule Modal */}
      {showAddScheduleModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddScheduleModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-entry p-4"
        >
          <div className="surface-card w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Schedule Hotel Operation</h3>
              <button
                onClick={() => setShowAddScheduleModal(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 transition"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="h-5 w-5 rotate-45" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const title = String(formData.get("title") || "");
                const time = String(formData.get("time") || "");
                const dateVal = String(formData.get("date") || "");
                const course = String(formData.get("course") || "");
                const colors: Array<"teal" | "indigo" | "blue" | "purple" | "emerald"> = [
                  "teal",
                  "indigo",
                  "blue",
                  "purple",
                  "emerald"
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];

                handleAddSchedule({
                  title,
                  time,
                  date: dateVal,
                  course,
                  color
                });
                setShowAddScheduleModal(false);
              }}
              className="space-y-4"
            >
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Operation / Event Title</span>
                <input
                  name="title"
                  required
                  placeholder="e.g. VIP Penthouse 401 Check-In"
                  className="app-input"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Time Slot</span>
                  <select
                    name="time"
                    className="app-select"
                  >
                    <option>10am - 12pm</option>
                    <option>1pm - 2pm</option>
                    <option>3pm - 4pm</option>
                    <option>11am - 12pm</option>
                    <option>2pm - 3pm</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Operation Date</span>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={formatDateKey(selectedDate)}
                    className="app-input"
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Suite / Department</span>
                <select
                  name="course"
                  className="app-select"
                >
                  {coursesList.map((c) => (
                    <option key={c.title} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm"
              >
                Add to Schedule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Log Hours Modal */}
      {showLogHoursModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogHoursModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-entry p-4"
        >
          <div className="surface-card w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Log Room Occupancy</h3>
              <button
                onClick={() => setShowLogHoursModal(false)}
                className="rounded-full p-2 hover:bg-slate-100 transition"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="h-5 w-5 rotate-45" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const hours = parseFloat(String(formData.get("hours") || "85"));
                const courseTitle = String(formData.get("course") || coursesList[0]?.title || "");

                handleLogHours(hours, courseTitle);
                setShowLogHoursModal(false);
              }}
              className="space-y-4"
            >
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Occupancy Rate (%)</span>
                <input
                  name="hours"
                  type="number"
                  step="1"
                  min="10"
                  max="100"
                  required
                  defaultValue="85"
                  className="app-input"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">For Suite / Room</span>
                <select
                  name="course"
                  className="app-select"
                >
                  {coursesList.map((c) => (
                    <option key={c.title} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm"
              >
                Log Occupancy
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Book 1-on-1 Session Modal */}
      {bookingTeacher && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setBookingTeacher(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-entry p-4"
        >
          <div className="surface-card w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Assign Duty & Shift Briefing</h3>
              <button
                onClick={() => setBookingTeacher(null)}
                className="rounded-full p-2 hover:bg-slate-100 transition"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="h-5 w-5 rotate-45" />
              </button>
            </div>
            <div className="mb-4 flex items-center gap-3 bg-slate-50/80 border border-slate-200/60 p-3.5 rounded-xl">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <Image
                  src={bookingTeacher.avatar}
                  alt={bookingTeacher.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{bookingTeacher.name}</h4>
                <p className="text-xs font-medium text-slate-500">{bookingTeacher.title}</p>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const time = String(formData.get("time") || "");
                const dateVal = String(formData.get("date") || "");
                const course = String(formData.get("course") || "");

                handleBook1on1({
                  teacher: bookingTeacher,
                  time,
                  date: dateVal,
                  course
                });
                setBookingTeacher(null);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Time Slot</span>
                  <select
                    name="time"
                    className="app-select"
                  >
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>1:00 PM</option>
                    <option>2:30 PM</option>
                    <option>4:00 PM</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Duty Date</span>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={formatDateKey(selectedDate)}
                    className="app-input"
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Suite / Department</span>
                <select
                  name="course"
                  className="app-select"
                >
                  {coursesList.map((c) => (
                    <option key={c.title} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm"
              >
                Confirm Assignment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
