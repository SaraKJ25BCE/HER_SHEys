"use client";

import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import StepIndicator from "@/components/ui/StepIndicator";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import MentorCard from "@/components/booking/MentorCard";
import Calendar from "@/components/booking/Calendar";
import StatusBadge from "@/components/booking/StatusBadge";
import { useApp } from "@/context/AppContext";
import { useAsync } from "@/hooks/useApi";
import { formatDate } from "@/lib/utils";

const STEPS = ["Intake", "Skill Dashboard", "Sandbox", "Matches", "Mentor"];

export default function MentorshipPage() {
  const { mentors, bookings, profile, loadMentors, bookSlot, advanceBookingStatus } = useApp();
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [booking, setBooking] = useState(false);

  const { loading, error, retry } = useAsync(async () => {
    if (!mentors) await loadMentors(profile?.targetDomain);
  }, []);

  const handleBook = async (slot) => {
    setBooking(true);
    try {
      const b = await bookSlot(selectedMentor, slot);
      // Simulated mentor response, so the Pending -> Confirmed -> Completed
      // tracker below is actually demoable end to end.
      setTimeout(() => advanceBookingStatus(b.bookingId, "confirmed"), 4000);
      setSelectedMentor(null);
    } finally {
      setBooking(false);
    }
  };

  return (
    <PageShell
      title="Talk to someone who's been through it"
      subtitle="Mentors matched on the same stack and, often, the same kind of break."
    >
      <div className="mb-8">
        <StepIndicator steps={STEPS} current={4} />
      </div>

      {bookings.length > 0 && (
        <div className="mb-8 max-w-3xl">
          <h2 className="text-sm font-medium text-ink mb-3">Your bookings</h2>
          <div className="space-y-2">
            {bookings.map((b) => (
              <Card key={b.bookingId} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-ink font-medium">{b.mentorName}</p>
                  <p className="text-xs text-muted">
                    {b.mentorRole}, {formatDate(b.date)} at {b.time}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </Card>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && error && (
        <div className="max-w-lg">
          <p className="text-sm text-brick mb-3">Couldn't load mentors: {error}</p>
          <Button variant="ghost" onClick={retry}>Try again</Button>
        </div>
      )}

      {!loading && !error && mentors && (
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl items-start">
          {mentors.map((m) => (
            <div key={m.id} className="space-y-3">
              <MentorCard mentor={m} selected={selectedMentor?.id === m.id} onSelect={setSelectedMentor} />
              {selectedMentor?.id === m.id && (
                <Card className="bg-sunk/60">
                  <Calendar mentor={m} booking={booking} onBook={handleBook} />
                </Card>
              )}
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
