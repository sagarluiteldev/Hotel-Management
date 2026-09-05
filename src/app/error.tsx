"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, RefreshIcon, Home01Icon } from "@hugeicons/core-free-icons";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application segment error caught by ErrorBoundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[500px] w-full items-center justify-center p-6">
      <div className="surface-card w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-card sm:p-10">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <HugeiconsIcon icon={AlertCircleIcon} className="h-8 w-8" />
        </div>

        <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">
          Something went wrong
        </h2>

        <p className="mb-6 text-sm font-semibold leading-relaxed text-slate-500">
          An unexpected error occurred while loading this section. We have logged the issue and you can retry without losing your session.
        </p>

        {error.digest && (
          <p className="mb-6 rounded-xl bg-slate-50 px-3 py-2 font-mono text-xs font-semibold text-slate-400">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 shadow-sm"
          >
            <HugeiconsIcon icon={RefreshIcon} className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <HugeiconsIcon icon={Home01Icon} className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
