"use client";

import ReactMarkdown from "react-markdown";
import { Check } from "lucide-react";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { cx } from "@/lib/utils";

export default function DayCard({ day, onToggleTask }) {
  const total = day.tasks.length;
  const done = day.tasks.filter((t) => t.done).length;

  return (
    <Card>
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <p className="text-xs text-accent-dark font-medium">Day {day.day}</p>
          <h2 className="font-display text-xl text-ink">{day.title}</h2>
        </div>
      </div>
      <ProgressBar value={total ? Math.round((done / total) * 100) : 0} tone="sage" className="my-4" />

      <div className="markdown-body">
        <ReactMarkdown>{day.markdown}</ReactMarkdown>
      </div>

      <div className="mt-4 space-y-2">
        {day.tasks.map((task) => (
          <label
            key={task.id}
            className={cx(
              "flex items-center gap-3 border border-border rounded px-3 py-2.5 cursor-pointer transition-colors",
              task.done ? "bg-sage-light border-sage/30" : "hover:border-primary/40"
            )}
          >
            <span
              className={cx(
                "w-5 h-5 rounded flex items-center justify-center border shrink-0",
                task.done ? "bg-sage border-sage text-white" : "border-border"
              )}
            >
              {task.done && <Check size={13} />}
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={task.done}
              onChange={() => onToggleTask(day.day, task.id)}
            />
            <span className={cx("text-sm", task.done ? "text-ink/70 line-through" : "text-ink")}>
              {task.label}
            </span>
          </label>
        ))}
      </div>
    </Card>
  );
}
