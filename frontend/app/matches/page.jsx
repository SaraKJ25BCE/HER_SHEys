"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import StepIndicator from "@/components/ui/StepIndicator";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ReturnshipCard, SchemeCard } from "@/components/dashboard/MatchList";
import { useApp } from "@/context/AppContext";
import { useAsync } from "@/hooks/useApi";
import { cx } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const STEPS = ["Intake", "Skill Dashboard", "Sandbox", "Matches", "Mentor"];

export default function MatchesPage() {
  const router = useRouter();
  const { matches, loadMatches } = useApp();
  const [tab, setTab] = useState("returnships");

  const { loading, error, retry } = useAsync(async () => {
    if (!matches) await loadMatches();
  }, []);

  return (
    <PageShell
      title="Your matches"
      subtitle="Scored against your sandbox proof-of-work, not just your old résumé."
    >
      <div className="mb-8">
        <StepIndicator steps={STEPS} current={3} />
      </div>

      <div className="flex gap-1 mb-6 bg-sunk rounded p-1 w-fit">
        {[
          { id: "returnships", label: "Returnships" },
          { id: "schemes", label: "Government schemes" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cx(
              "px-4 py-1.5 rounded text-sm font-medium transition-colors",
              tab === t.id ? "bg-paper text-ink shadow-card" : "text-muted"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && error && (
        <div className="max-w-lg">
          <p className="text-sm text-brick mb-3">Couldn't load matches: {error}</p>
          <Button variant="ghost" onClick={retry}>Try again</Button>
        </div>
      )}

      {!loading && !error && matches && (
        <>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
            {tab === "returnships"
              ? matches.returnships.map((r) => <ReturnshipCard key={r.id} item={r} />)
              : matches.schemes.map((s) => <SchemeCard key={s.id} item={s} />)}
          </div>

          <div className="mt-8">
            <Button variant="primary" onClick={() => router.push("/mentorship")}>
              Find a mentor <ArrowRight size={16} />
            </Button>
          </div>
        </>
      )}
    </PageShell>
  );
}
