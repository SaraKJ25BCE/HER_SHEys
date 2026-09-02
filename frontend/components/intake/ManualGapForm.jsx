"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const DOMAINS = ["Data & AI", "Software Engineering", "QA & Testing", "Product & UX", "Research (S&T)"];

export default function ManualGapForm({ onSubmit, loading }) {
  const [pastRole, setPastRole] = useState("");
  const [stack, setStack] = useState("");
  const [yearsOfBreak, setYearsOfBreak] = useState(3);
  const [targetDomain, setTargetDomain] = useState(DOMAINS[0]);
  const [touched, setTouched] = useState(false);

  const valid = pastRole.trim().length > 1 && stack.trim().length > 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    onSubmit({
      pastRole: pastRole.trim(),
      stack: stack.split(",").map((s) => s.trim()).filter(Boolean),
      yearsOfBreak: Number(yearsOfBreak),
      targetDomain,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="pastRole">
          Your last role
        </label>
        <input
          id="pastRole"
          value={pastRole}
          onChange={(e) => setPastRole(e.target.value)}
          placeholder="e.g. Data Analyst"
          className="mt-1.5 w-full rounded border border-border px-3 py-2 text-sm bg-paper focus:border-primary"
        />
        {touched && !pastRole.trim() && (
          <p className="text-xs text-brick mt-1">Tell us your last role.</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-ink" htmlFor="stack">
          Tools & skills you used then
        </label>
        <input
          id="stack"
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          placeholder="e.g. SQL, Excel, Python (basic)"
          className="mt-1.5 w-full rounded border border-border px-3 py-2 text-sm bg-paper focus:border-primary"
        />
        <p className="text-xs text-muted mt-1">Comma-separated is fine.</p>
        {touched && !stack.trim() && (
          <p className="text-xs text-brick mt-1">List at least one skill.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="yearsOfBreak">
            Length of break (years)
          </label>
          <input
            id="yearsOfBreak"
            type="number"
            min={0}
            max={20}
            value={yearsOfBreak}
            onChange={(e) => setYearsOfBreak(e.target.value)}
            className="mt-1.5 w-full rounded border border-border px-3 py-2 text-sm bg-paper focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="targetDomain">
            Target domain
          </label>
          <select
            id="targetDomain"
            value={targetDomain}
            onChange={(e) => setTargetDomain(e.target.value)}
            className="mt-1.5 w-full rounded border border-border px-3 py-2 text-sm bg-paper focus:border-primary"
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Analyzing…" : "Analyze my skills"}
      </Button>
    </form>
  );
}
