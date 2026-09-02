import { cx } from "@/lib/utils";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cx("bg-paper border border-border rounded-lg shadow-card p-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}
