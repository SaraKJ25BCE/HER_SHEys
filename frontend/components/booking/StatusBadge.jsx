import Badge from "@/components/ui/Badge";

const CONFIG = {
  pending: { tone: "accent", label: "Pending" },
  confirmed: { tone: "sage", label: "Confirmed" },
  completed: { tone: "primary", label: "Completed" },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || CONFIG.pending;
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}
