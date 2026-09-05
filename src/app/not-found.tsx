import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Home01Icon } from "@hugeicons/core-free-icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[500px] w-full items-center justify-center p-6">
      <div className="surface-card w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-card sm:p-10">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
          <HugeiconsIcon icon={Search01Icon} className="h-8 w-8" />
        </div>

        <span className="mb-2 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-indigo-700">
          404 Not Found
        </span>

        <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">
          Page does not exist
        </h2>

        <p className="mb-6 text-sm font-semibold leading-relaxed text-slate-500">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 shadow-sm"
        >
          <HugeiconsIcon icon={Home01Icon} className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
