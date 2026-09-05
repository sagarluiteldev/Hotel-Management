"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BedDoubleIcon,
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  CrownIcon,
  DashboardSquare01Icon,
  LockIcon,
  Mail01Icon,
  SparklesIcon,
  UserIcon,
  ViewIcon,
  ViewOffIcon
} from "@hugeicons/core-free-icons";

type AuthMode = "signin" | "signup";

export function AuthPage({ mode }: { mode: AuthMode }) {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  function fillDemo() {
    setEmail("brenda@example.com");
    setPassword("learnpro");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    // Redirect to the page the user originally tried to visit, or dashboard
    const redirectTo = searchParams.get("redirect") || "/";
    window.location.href = redirectTo;
  }

  return (
    <main className="min-h-screen bg-appBg p-3 text-slate-950 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1180px] overflow-hidden rounded-[2.5rem] bg-white shadow-soft lg:grid-cols-[1fr_0.95fr]">
        <section className="relative flex min-h-[560px] flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-100 via-indigo-100 to-white p-8 sm:p-10">
          <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-white/50 blur-3xl" />
          <div className="absolute -bottom-20 left-12 h-64 w-64 rounded-full bg-cyan-200/60 blur-3xl" />
          <Link href="/" className="relative z-10 flex w-fit items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-slate-950 bg-white/70">
              <HugeiconsIcon icon={CrownIcon} className="h-6 w-6 text-slate-950" />
            </span>
            <span className="text-2xl font-extrabold tracking-tight">Grand Haven.</span>
          </Link>

          <div className="relative z-10 max-w-lg">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-extrabold text-slate-800 shadow-sm">
              <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4" />
              Luxury Hospitality Operations
            </span>
            <h1 className="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {isSignup ? "Manage your luxury property with ease." : "Hotel Operations & Management Portal"}
            </h1>
            <p className="text-base font-semibold leading-7 text-slate-600">
              Oversee suites, staff duty handovers, guest arrivals, and housekeeping work orders in one unified operational command center.
            </p>
          </div>

          <div className="relative z-10 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Suites", value: "148", icon: BedDoubleIcon },
              { label: "Occupancy", value: "92%", icon: CheckmarkCircle02Icon },
              { label: "Daily SOPs", value: "36", icon: BookOpen01Icon }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-[1.5rem] bg-white/70 p-4 shadow-sm backdrop-blur">
                  <HugeiconsIcon icon={Icon} className="mb-4 h-5 w-5 text-slate-700" />
                  <div className="text-2xl font-extrabold">{item.value}</div>
                  <div className="text-xs font-bold text-slate-500">{item.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex items-center p-8 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white">
                <HugeiconsIcon icon={DashboardSquare01Icon} className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-3xl font-extrabold tracking-tight">
                {isSignup ? "Create manager account" : "Sign in to portal"}
              </h2>
              <p className="font-semibold text-slate-500">
                {isSignup ? "Your property dashboard will be ready instantly." : "Access your hotel operational command center."}
              </p>
            </div>

            {!isSignup && (
              <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-teal-200 bg-teal-50/70 p-3.5 text-xs">
                <div>
                  <div className="font-extrabold text-slate-900">Manager Demo Account</div>
                  <div className="font-semibold text-slate-600">brenda@example.com • learnpro</div>
                </div>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-slate-800"
                >
                  Quick Fill
                </button>
              </div>
            )}

            <form className="space-y-4" onSubmit={submit}>
              {isSignup && (
                <label className="block">
                  <span className="mb-2 block text-sm font-extrabold">Full name</span>
                  <span className="relative block">
                    <HugeiconsIcon icon={UserIcon} className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      name="name"
                      placeholder="Your full name"
                      className="h-14 w-full rounded-2xl border-0 bg-slate-50 pl-12 pr-4 font-semibold outline-none focus:bg-white focus:shadow-sm"
                    />
                  </span>
                </label>
              )}
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">Email</span>
                <span className="relative block">
                  <HugeiconsIcon icon={Mail01Icon} className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@grandhavenhotel.com"
                    className="h-14 w-full rounded-2xl border-0 bg-slate-50 pl-12 pr-4 font-semibold outline-none focus:bg-white focus:shadow-sm"
                  />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">Password</span>
                <span className="relative block">
                  <HugeiconsIcon icon={LockIcon} className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    placeholder="Min 6 characters"
                    className="h-14 w-full rounded-2xl border-0 bg-slate-50 pl-12 pr-14 font-semibold outline-none focus:bg-white focus:shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <HugeiconsIcon icon={ViewOffIcon} className="h-5 w-5" />
                    ) : (
                      <HugeiconsIcon icon={ViewIcon} className="h-5 w-5" />
                    )}
                  </button>
                </span>
              </label>

              {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-slate-950 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Please wait..." : isSignup ? "Create manager account" : "Sign in to portal"}
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-slate-500">
              {isSignup ? "Already have an account?" : "New manager?"}{" "}
              <Link href={isSignup ? "/signin" : "/signup"} className="font-extrabold text-slate-950">
                {isSignup ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
