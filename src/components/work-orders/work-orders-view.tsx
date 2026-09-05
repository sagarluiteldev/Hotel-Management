"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ClipboardListIcon,
  Clock01Icon,
  CloudUploadIcon,
  FileCheckIcon
} from "@hugeicons/core-free-icons";
import type { WorkOrder } from "@/lib/hotel-data";
import { useDashboard } from "@/context/dashboard-context";
import { cx, SectionHeading } from "../dashboard/shared";

export function WorkOrdersView() {
  const { tasks: workOrdersList, moveTask, submitWork } = useDashboard();
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<WorkOrder["status"]>("todo");

  const columns: Array<{ key: WorkOrder["status"]; label: string }> = [
    { key: "todo", label: "Pending Dispatch" },
    { key: "progress", label: "In Progress" },
    { key: "submitted", label: "Completed & Inspected" }
  ];

  return (
    <main className="grid gap-4 sm:gap-6 xl:grid-cols-[1fr_360px]">
      <section className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
        <SectionHeading
          icon={<HugeiconsIcon icon={ClipboardListIcon} className="h-5 w-5" />}
          title="Operations & Work Orders"
        >
          <span className="rounded-full bg-rose-100 px-2.5 sm:px-3 py-1 text-xs font-bold text-rose-900">
            {workOrdersList.filter((t) => t.status !== "submitted").length} active orders
          </span>
        </SectionHeading>

        {/* Mobile / Tablet Segmented Tab Switcher (< lg) */}
        <div className="flex lg:hidden rounded-xl border border-slate-200/80 bg-slate-100 p-1 mb-4 gap-1">
          {columns.map((column) => {
            const count = workOrdersList.filter((task) => task.status === column.key).length;
            const isSelected = activeTab === column.key;
            return (
              <button
                key={column.key}
                type="button"
                onClick={() => setActiveTab(column.key)}
                className={cx(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 px-1 text-xs font-bold transition text-center",
                  isSelected
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-950"
                )}
              >
                <span className="truncate">{column.label.split(" ")[0]}</span>
                <span
                  className={cx(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold",
                    isSelected ? "bg-slate-950 text-white" : "bg-slate-200 text-slate-700"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => (
            <div
              key={column.key}
              className={cx(
                "rounded-xl border border-slate-200/60 bg-slate-50/70 p-3.5 sm:p-4",
                activeTab !== column.key && "hidden lg:block"
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700">{column.label}</h3>
                <span className="rounded-full bg-white border border-slate-200/60 px-2 py-0.5 text-xs font-bold text-slate-600">
                  {workOrdersList.filter((task) => task.status === column.key).length}
                </span>
              </div>
              <div className="space-y-3">
                {workOrdersList
                  .filter((task) => task.status === column.key)
                  .map((task) => (
                    <article key={task.id} className="rounded-lg border border-slate-200/70 bg-white p-4 shadow-sm transition hover:shadow-card">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-extrabold leading-snug">{task.title}</h4>
                          <p className="mt-1 text-xs font-semibold text-slate-500">{task.course}</p>
                        </div>
                        <span
                          className={cx(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-extrabold",
                            task.priority === "High" && "bg-rose-100 text-rose-900",
                            task.priority === "Medium" && "bg-indigo-100 text-indigo-900",
                            task.priority === "Low" && "bg-teal-100 text-teal-900"
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="mb-4 flex items-center justify-between text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5 text-slate-400" />
                          {task.due}
                        </span>
                        <span className="font-semibold text-slate-600">{task.deadline}</span>
                      </div>
                      <div className="flex gap-2">
                        {task.status !== "progress" && task.status !== "submitted" && (
                          <button
                            type="button"
                            onClick={() => moveTask(task.id, "progress")}
                            className="grid h-8 flex-1 place-items-center rounded-lg border border-slate-200/70 bg-slate-50 text-xs font-extrabold text-slate-700 transition hover:bg-slate-950 hover:text-white"
                          >
                            Dispatch
                          </button>
                        )}
                        {task.status !== "submitted" && (
                          <button
                            type="button"
                            onClick={() => moveTask(task.id, "submitted")}
                            className="grid h-8 flex-1 place-items-center rounded-lg bg-slate-950 text-xs font-extrabold text-white transition hover:bg-slate-800"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="surface-card rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
        <SectionHeading icon={<HugeiconsIcon icon={CloudUploadIcon} className="h-5 w-5" />} title="Work Order Log & Inspection" />
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            await submitWork(e);
            setSelectedFileName("");
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Select Work Order</span>
            <select name="taskId" className="app-select">
              {workOrdersList.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Inspection & Resolution Notes</span>
            <textarea
              name="note"
              rows={3}
              placeholder="Add resolution details, checklist items completed, or maintenance notes..."
              className="app-input resize-none"
            />
          </label>
          <label className="grid min-h-[110px] cursor-pointer place-items-center rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50 p-4 text-center transition">
            <input
              name="file"
              type="file"
              accept=".pdf,.zip,.png,.jpg,.jpeg,application/pdf,application/zip,image/png,image/jpeg"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setSelectedFileName(file ? file.name : "");
              }}
            />
            {selectedFileName ? (
              <span className="flex flex-col items-center gap-1">
                <HugeiconsIcon icon={FileCheckIcon} className="h-6 w-6 text-emerald-600" />
                <span className="block max-w-[260px] truncate text-sm font-bold text-slate-900">
                  {selectedFileName}
                </span>
                <span className="text-xs font-semibold text-emerald-600">Click to change file</span>
              </span>
            ) : (
              <span>
                <HugeiconsIcon icon={CloudUploadIcon} className="mx-auto mb-1.5 h-6 w-6 text-slate-400" />
                <span className="block text-sm font-bold text-slate-700">Attach checklist or inspection photo</span>
                <span className="text-xs font-medium text-slate-400">PDF, JPG, PNG up to 10MB</span>
              </span>
            )}
          </label>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 shadow-sm"
          >
            Log Completion
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
          </button>
        </form>
      </aside>
    </main>
  );
}

export const TasksView = WorkOrdersView;
