"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import StepIndicator from "@/components/ui/StepIndicator";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { SkeletonCard } from "@/components/ui/Skeleton";
import MilestoneTracker from "@/components/sandbox/MilestoneTracker";
import DayCard from "@/components/sandbox/DayCard";
import { useApp } from "@/context/AppContext";
import { useAsync } from "@/hooks/useApi";
import { ArrowRight, Sparkles } from "lucide-react";

const STEPS = ["Intake", "Skill Dashboard", "Sandbox", "Matches", "Mentor"];

export default function SandboxPage() {
  const router = useRouter();
  const { sandbox, sandboxProgress, loadSandbox, toggleTask, finishSandbox } = useApp();
  const [activeDay, setActiveDay] = useState(1);
  const [generating, setGenerating] = useState(false);

  const { loading, error, retry } = useAsync(async () => {
    if (!sandbox) {
      const s = await loadSandbox();
      setActiveDay(s.days[0]?.day ?? 1);
    }
  }, []);

  const currentDay = sandbox?.days.find((d) => d.day === activeDay);
  const allDone =
    sandbox?.days.flatMap((d) => d.tasks).every((t) => t.done) && sandbox?.days.length > 0;

  const handleGenerateProof = async () => {
    setGenerating(true);
    try {
      await finishSandbox();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PageShell
      title="Micro-Returnship Sandbox"
      subtitle={sandbox ? sandbox.title : "A 5-day bridge from your legacy stack to today's."}
    >
      <div className="mb-8">
        <StepIndicator steps={STEPS} current={2} />
      </div>

      {loading && (
        <div className="space-y-4 max-w-2xl">
          <SkeletonCard />
        </div>
      )}

      {!loading && error && (
        <Card className="max-w-lg">
          <p className="text-sm text-brick mb-3">Couldn't load your sandbox: {error}</p>
          <Button variant="ghost" onClick={retry}>Try again</Button>
        </Card>
      )}

      {!loading && !error && sandbox && (
        <div className="grid md:grid-cols-[220px_1fr] gap-6 max-w-4xl">
          <div>
            <ProgressBar value={sandboxProgress} tone="sage" label="Overall progress" className="mb-4" />
            <MilestoneTracker days={sandbox.days} activeDay={activeDay} onSelectDay={setActiveDay} />
          </div>

          <div className="space-y-6">
            {currentDay && <DayCard day={currentDay} onToggleTask={toggleTask} />}

            {activeDay === 5 && (
              <Card className="bg-accent-light border-accent/30">
                {!sandbox.proofOfWorkSummary ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-accent-dark" />
                      <h3 className="font-display text-lg text-accent-dark">Generate your proof of work</h3>
                    </div>
                    <p className="text-sm text-accent-dark/80 mb-4 max-w-prose">
                      This turns the week into the paragraph and skill tags you'll use in
                      applications and mentor conversations.
                    </p>
                    <Button
                      variant="accent"
                      disabled={!allDone || generating}
                      onClick={handleGenerateProof}
                    >
                      {generating ? "Generating…" : allDone ? "Generate proof of work" : "Finish all tasks first"}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-accent-dark font-medium mb-2">Your proof-of-work summary</p>
                    <p className="text-ink leading-relaxed mb-3 max-w-prose">
                      {sandbox.proofOfWorkSummary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {(sandbox.skillTags || []).map((tag) => (
                        <Badge key={tag} tone="accent">{tag}</Badge>
                      ))}
                    </div>
                    <Button variant="primary" onClick={() => router.push("/matches")}>
                      See your matches <ArrowRight size={16} />
                    </Button>
                  </>
                )}
              </Card>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
}
