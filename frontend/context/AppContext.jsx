"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  analyzeResume,
  submitManualSkills,
  getSandbox,
  updateSandboxProgress,
  completeSandbox,
  getMatches,
  getMentors,
  bookMentorSlot,
} from "@/lib/api";
import { getStoredProfileId, setStoredProfileId } from "@/lib/session";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [sandbox, setSandbox] = useState(null);
  const [matches, setMatches] = useState(null);
  const [mentors, setMentors] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [dataSourceNotice, setDataSourceNotice] = useState(null); // "mock" | null

  useEffect(() => {
    // Rehydrate profile id on load (profile object itself is not persisted —
    // in a full build this would refetch from backend by id).
    getStoredProfileId();
  }, []);

  const noteSource = useCallback((result) => {
    if (result.source === "mock") {
      setDataSourceNotice(
        result.error || "Showing sample data — connect the backend to see live results."
      );
    } else {
      setDataSourceNotice(null);
    }
  }, []);

  const runResumeAnalysis = useCallback(
    async (file) => {
      const result = await analyzeResume(file);
      noteSource(result);
      setProfile(result.data);
      setStoredProfileId(result.data.profileId);
      return result.data;
    },
    [noteSource]
  );

  const runManualSkills = useCallback(
    async (payload) => {
      const result = await submitManualSkills(payload);
      noteSource(result);
      setProfile(result.data);
      setStoredProfileId(result.data.profileId);
      return result.data;
    },
    [noteSource]
  );

  const loadSandbox = useCallback(async () => {
    const pid = profile?.profileId || getStoredProfileId();
    const result = await getSandbox(pid);
    noteSource(result);
    setSandbox(result.data);
    return result.data;
  }, [profile, noteSource]);

  const toggleTask = useCallback(
    async (dayNumber, taskId) => {
      setSandbox((prev) => {
        if (!prev) return prev;
        const days = prev.days.map((d) =>
          d.day !== dayNumber
            ? d
            : { ...d, tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
        );
        return { ...prev, days };
      });
      const day = sandbox?.days.find((d) => d.day === dayNumber);
      const task = day?.tasks.find((t) => t.id === taskId);
      const nextDone = task ? !task.done : true;
      await updateSandboxProgress(sandbox?.sandboxId, taskId, nextDone);
    },
    [sandbox]
  );

  const finishSandbox = useCallback(async () => {
    const result = await completeSandbox(sandbox?.sandboxId);
    noteSource(result);
    setSandbox((prev) => (prev ? { ...prev, proofOfWorkSummary: result.data.proofOfWorkSummary, skillTags: result.data.skillTags } : prev));
    return result.data;
  }, [sandbox, noteSource]);

  const loadMatches = useCallback(async () => {
    const pid = profile?.profileId || getStoredProfileId();
    const result = await getMatches(pid);
    noteSource(result);
    setMatches(result.data);
    return result.data;
  }, [profile, noteSource]);

  const loadMentors = useCallback(
    async (domain) => {
      const result = await getMentors(domain);
      noteSource(result);
      setMentors(result.data);
      return result.data;
    },
    [noteSource]
  );

  const bookSlot = useCallback(
    async (mentor, slot) => {
      const result = await bookMentorSlot(mentor.id, slot.slotId);
      noteSource(result);
      const booking = {
        ...result.data,
        mentorName: mentor.name,
        mentorRole: mentor.role,
        date: slot.date,
        time: slot.time,
      };
      setBookings((prev) => [booking, ...prev]);
      return booking;
    },
    [noteSource]
  );

  const advanceBookingStatus = useCallback((bookingId, status) => {
    setBookings((prev) => prev.map((b) => (b.bookingId === bookingId ? { ...b, status } : b)));
  }, []);

  const sandboxProgress = useMemo(() => {
    if (!sandbox) return 0;
    const all = sandbox.days.flatMap((d) => d.tasks);
    if (all.length === 0) return 0;
    return Math.round((all.filter((t) => t.done).length / all.length) * 100);
  }, [sandbox]);

  const value = {
    profile,
    sandbox,
    matches,
    mentors,
    bookings,
    dataSourceNotice,
    sandboxProgress,
    runResumeAnalysis,
    runManualSkills,
    loadSandbox,
    toggleTask,
    finishSandbox,
    loadMatches,
    loadMentors,
    bookSlot,
    advanceBookingStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
