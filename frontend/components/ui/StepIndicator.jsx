import { Check } from "lucide-react";
import { cx } from "@/lib/utils";

export default function StepIndicator({ steps, current }) {
  return (
    <ol className="flex items-center w-full">
      {steps.map((step, idx) => {
        const state = idx < current ? "done" : idx === current ? "current" : "upcoming";
        return (
          <li key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cx(
                  "flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0",
                  state === "done" && "bg-sage text-white",
                  state === "current" && "bg-primary text-white",
                  state === "upcoming" && "bg-sunk text-muted"
                )}
              >
                {state === "done" ? <Check size={14} /> : idx + 1}
              </span>
              <span
                className={cx(
                  "text-sm hidden sm:inline",
                  state === "current" ? "text-ink font-medium" : "text-muted"
                )}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cx("flex-1 h-px mx-3", state === "done" ? "bg-sage" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
