import { cx } from "@/lib/utils";

const tones = {
  primary: "bg-primary-light text-primary-dark",
  accent: "bg-accent-light text-accent-dark",
  sage: "bg-sage-light text-sage-dark",
  neutral: "bg-sunk text-muted",
  brick: "bg-brick-light text-brick",
};

export default function Badge({ tone = "neutral", children, className }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
