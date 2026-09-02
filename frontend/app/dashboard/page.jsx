"use client";

import { useRouter } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import StepIndicator from "@/components/ui/StepIndicator";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import SkillGapChart from "@/components/dashboard/SkillGapChart";
import SkillRadar from "@/components/dashboard/SkillRadar";
import { useApp } from "@/context/AppContext";
import { ArrowRight } from "lucide-react";

const STEPS = ["Intake", "Skill Dashboard", "Sandbox", "Matches", "Mentor"];

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useApp();

  return (
    <PageShell
      title={profile ? `Hi ${profile.candidateName.split(" ")[0]}, here's where you stand` : "Skill Dashboard"}
      subtitle="Legacy skills, mapped against what your target role uses today."
    >
      <div className="mb-8">
        <StepIndicator steps={STEPS} current={1} />
      </div>

      {!profile ? (
        <div className="space-y-4 max-w-2xl">
          <p className="text-sm text-muted">
            No skill profile yet —{" "}
            <button className="text-primary underline" onClick={() => router.push("/intake")}>
              start with the intake step
            </button>
            .
          </p>
          <SkeletonCard />
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl">
          <Card>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm text-ink leading-relaxed max-w-prose">{profile.gapSummary}</p>
              </div>
              <Badge tone="accent">{profile.yearsOfBreak}-year break</Badge>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-display text-lg text-ink mb-1">Current vs. 2026 target</h3>
              <p className="text-xs text-muted mb-3">Per-skill level, out of 100</p>
              <SkillGapChart marketSkills={profile.marketSkills} />
            </Card>
            <Card>
              <h3 className="font-display text-lg text-ink mb-1">Legacy vs. target shape</h3>
              <p className="text-xs text-muted mb-3">Where the biggest gaps sit at a glance</p>
              <SkillRadar legacySkills={profile.legacySkills} marketSkills={profile.marketSkills} />
            </Card>
          </div>

          <Card className="bg-primary-light border-primary/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-display text-lg text-primary-dark">
                  Close the gap in 5 days
                </h3>
                <p className="text-sm text-primary-dark/80 mt-1 max-w-prose">
                  Your Micro-Returnship Sandbox is generated from this exact gap — Snowflake and
                  GenAI APIs, bridged from the SQL and Excel you already know.
                </p>
              </div>
              <Button variant="primary" onClick={() => router.push("/sandbox")}>
                Start the sandbox <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </PageShell>
  );
}
