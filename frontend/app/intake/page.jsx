"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import StepIndicator from "@/components/ui/StepIndicator";
import Card from "@/components/ui/Card";
import { cx } from "@/lib/utils";
import ResumeUpload from "@/components/intake/ResumeUpload";
import ManualGapForm from "@/components/intake/ManualGapForm";
import { useApp } from "@/context/AppContext";

const STEPS = ["Intake", "Skill Dashboard", "Sandbox", "Matches", "Mentor"];

export default function IntakePage() {
  const router = useRouter();
  const { runResumeAnalysis, runManualSkills } = useApp();
  const [mode, setMode] = useState("resume");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResume = async (file) => {
    setLoading(true);
    setError(null);
    try {
      await runResumeAnalysis(file);
      router.push("/dashboard");
    } catch (e) {
      setError("Couldn't analyze that file right now. Try again, or use the manual form.");
    } finally {
      setLoading(false);
    }
  };

  const handleManual = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await runManualSkills(payload);
      router.push("/dashboard");
    } catch (e) {
      setError("Something went wrong submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Let's see where you stand"
      subtitle="Upload a résumé, or tell us directly — either way takes about two minutes."
    >
      <div className="mb-8">
        <StepIndicator steps={STEPS} current={0} />
      </div>

      <Card className="max-w-xl">
        <div className="flex gap-1 mb-6 bg-sunk rounded p-1 w-fit">
          {[
            { id: "resume", label: "Upload résumé" },
            { id: "manual", label: "Enter manually" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={cx(
                "px-4 py-1.5 rounded text-sm font-medium transition-colors",
                mode === tab.id ? "bg-paper text-ink shadow-card" : "text-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-brick bg-brick-light border border-brick/20 rounded px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {mode === "resume" ? (
          <ResumeUpload onSubmit={handleResume} loading={loading} />
        ) : (
          <ManualGapForm onSubmit={handleManual} loading={loading} />
        )}
      </Card>
    </PageShell>
  );
}
