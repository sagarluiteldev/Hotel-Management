import type { Metadata } from "next";
import "./globals.css";
import { DashboardProvider } from "@/context/dashboard-context";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Grand Haven Hotel & Suites | Operations Management Dashboard",
  description: "Enterprise hotel management system dashboard for Grand Haven Hotel & Suites. Oversee suites, occupancy analytics, department handovers, and housekeeping work orders."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DashboardProvider>
          <AppShell>{children}</AppShell>
        </DashboardProvider>
      </body>
    </html>
  );
}
