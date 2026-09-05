"use client";

import { DashboardView } from "@/components/dashboard/dashboard-view";
import { StaffView } from "@/components/staff/staff-view";
import { RoomsView } from "@/components/rooms/rooms-view";
import { WorkOrdersView } from "@/components/work-orders/work-orders-view";
import { SettingsView } from "@/components/settings/settings-view";
import { ProfileView } from "@/components/profile/profile-view";

type View = "dashboard" | "staff" | "rooms" | "work-orders" | "settings" | "profile" | "teachers" | "classes" | "tasks";

export function HotelApp({ view }: { view: View }) {
  if (view === "staff" || view === "teachers") return <StaffView />;
  if (view === "rooms" || view === "classes") return <RoomsView />;
  if (view === "work-orders" || view === "tasks") return <WorkOrdersView />;
  if (view === "settings") return <SettingsView />;
  if (view === "profile") return <ProfileView />;
  return <DashboardView />;
}

export const LearningApp = HotelApp;
