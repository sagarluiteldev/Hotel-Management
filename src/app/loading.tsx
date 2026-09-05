export default function Loading() {
  return (
    <div className="w-full animate-pulse space-y-6" aria-busy="true" aria-label="Loading page content...">
      {/* Top Banner Skeleton */}
      <div className="h-44 w-full rounded-3xl bg-slate-200/70" />

      {/* Main Grid Skeleton */}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="h-7 w-48 rounded-xl bg-slate-200/70" />
            <div className="h-5 w-20 rounded-lg bg-slate-200/50" />
          </div>

          {/* Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/70 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-200/80" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 rounded bg-slate-200/80" />
                    <div className="h-3 w-16 rounded bg-slate-200/50" />
                  </div>
                </div>
                <div className="mt-8 space-y-2">
                  <div className="h-3 w-full rounded bg-slate-200/60" />
                  <div className="h-2 w-3/4 rounded bg-slate-200/40" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Chart Card Skeleton */}
          <div className="h-64 rounded-2xl bg-white/70 p-6 shadow-sm">
            <div className="mb-4 h-6 w-40 rounded-lg bg-slate-200/70" />
            <div className="flex h-44 items-end gap-3 pt-4">
              {[40, 65, 30, 85, 60, 95, 45].map((height, idx) => (
                <div key={idx} className="flex-1 rounded-t-lg bg-slate-200/60" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column / Sidebar */}
        <div className="space-y-6">
          <div className="h-72 rounded-2xl bg-white/70 p-6 shadow-sm">
            <div className="mb-4 h-6 w-32 rounded-lg bg-slate-200/70" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200/80" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-24 rounded bg-slate-200/80" />
                    <div className="h-3 w-36 rounded bg-slate-200/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-60 rounded-2xl bg-white/70 p-6 shadow-sm">
            <div className="mb-4 h-6 w-28 rounded-lg bg-slate-200/70" />
            <div className="space-y-2">
              <div className="h-12 w-full rounded-xl bg-slate-200/50" />
              <div className="h-12 w-full rounded-xl bg-slate-200/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
