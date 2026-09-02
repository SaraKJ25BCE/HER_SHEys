import { cx } from "@/lib/utils";

export default function ProgressBar({ value = 0, className, tone = "primary", label }) {
  const tones = {
    primary: "bg-primary",
    accent: "bg-accent",
    sage: "bg-sage",
  };
  return (
    <div className={cx("w-full", className)}>
      {label && (
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full rounded-full bg-sunk overflow-hidden"
      >
        <div
          className={cx("h-full rounded-full transition-all duration-500", tones[tone])}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
