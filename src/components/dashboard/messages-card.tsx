"use client";

import React, { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Comment01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
  Search01Icon,
  SentIcon
} from "@hugeicons/core-free-icons";
import { useDashboard } from "@/context/dashboard-context";
import { Avatar, cx, IconButton, SectionHeading } from "./shared";

export function MessagesCard() {
  const { messagesList, setActiveChatContact } = useDashboard();
  const [searchVal, setSearchVal] = useState("");

  const filtered = useMemo(() => {
    const norm = searchVal.trim().toLowerCase();
    if (!norm) return messagesList;
    return messagesList.filter((m) => m.name.toLowerCase().includes(norm));
  }, [searchVal, messagesList]);

  return (
    <section className="surface-card animate-entry delay-3 flex min-h-[320px] flex-col rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-card">
      <SectionHeading icon={<HugeiconsIcon icon={Comment01Icon} className="h-5 w-5" />} title="Department Comms">
        <div className="flex items-center gap-1">
          <IconButton label="New staff message" onClick={() => setActiveChatContact("Arlene McCoy")}>
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
          </IconButton>
          <button type="button" aria-label="Comms options" className="rounded-full p-2 hover:bg-slate-100">
            <HugeiconsIcon icon={MoreHorizontalIcon} className="h-5 w-5" />
          </button>
        </div>
      </SectionHeading>
      <div className="relative mb-4">
        <HugeiconsIcon
          icon={Search01Icon}
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search staff or channel..."
          className="muted-surface w-full rounded-xl border border-slate-200/70 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-semibold outline-none transition focus:bg-white focus:border-slate-900 focus:shadow-xs"
        />
      </div>
      <div className="app-scrollbar flex-1 space-y-2 overflow-auto pr-1">
        {filtered.map((message) => (
          <button
            key={message.name}
            type="button"
            onClick={() => setActiveChatContact(message.name)}
            className="group flex w-full items-center justify-between rounded-xl p-2.5 text-left transition hover:bg-slate-50/80 border border-transparent hover:border-slate-200/50"
          >
            <span className="flex min-w-0 items-center gap-3">
              <Avatar src={message.avatar} name={message.name} className="h-11 w-11" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-extrabold">{message.name}</span>
                <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                  <span className={cx("h-1.5 w-1.5 rounded-full", message.color)} />
                  {message.status}
                </span>
              </span>
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-slate-500 opacity-0 shadow-sm transition group-hover:opacity-100">
              <HugeiconsIcon icon={SentIcon} className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
