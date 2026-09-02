"use client";

import { Check } from "lucide-react";
import { cx } from "@/lib/utils";

export default function MilestoneTracker({ days = [], activeDay, onSelectDay }) {
  return (
    <ol className="thread space-y-1">
      {days.map((d) => {
        const total = d.tasks.length;
        const done = d.tasks.filter((t) => t.done).length;
        const complete = total > 0 && done === total;
        const active = d.day === activeDay;
        return (
          <li key={d.day}>
            <button
              onClick={() => onSelectDay(d.day)}
              className={cx(
                "w-full text-left relative pl-11 py-2.5 rounded transition-colors",
                active ? "bg-primary-light" : "hover:bg-sunk"
              )}
            >
              <span
                className={cx(
                  "absolute left-0 top-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                  complete ? "bg-sage text-white" : active ? "bg-primary text-white" : "bg-sunk text-muted"
                )}
              >
                {complete ? <Check size={14} /> : `D${d.day}`}
              </span>
              <span className={cx("text-sm block", active ? "text-ink font-medium" : "text-ink")}>
                {d.title}
              </span>
              <span className="text-xs text-muted">
                {done}/{total} tasks
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
