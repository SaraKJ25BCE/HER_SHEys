// Thin API client. Every function tries the real backend first (see
// docs/API_CONTRACT.md for exact shapes) and falls back to mock data if the
// backend isn't reachable yet — so the frontend is demo-safe standalone.
//
// Every function resolves to { data, source } where source is "live" or "mock",
// never throws for network failures (only for genuine 4xx/5xx after connecting),
// so callers can render a "showing sample data" hint without extra try/catch.

import { getOrCreateToken } from "./session";
import {
  SAMPLE_RETURNSHIPS,
  SAMPLE_SCHEMES,
  SAMPLE_MENTORS,
  mockAnalyzeSkills,
  mockGenerateSandbox,
  mockProofOfWork,
} from "./mockData";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 6000;

async function request(path, options = {}) {
  const token = getOrCreateToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const err = new Error(`Request failed (${res.status})`);
      err.status = res.status;
      err.backendReachable = true;
      throw err;
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Wraps a live call + a mock fallback with a consistent { data, source, error } shape. */
async function withFallback(liveCall, mockFactory, mockDelayMs = 500) {
  try {
    const data = await liveCall();
    return { data, source: "live", error: null };
  } catch (err) {
    // Backend unreachable, timed out, or not implemented yet — fall back to mock data.
    await delay(mockDelayMs);
    if (err && err.backendReachable) {
      // Backend responded but with an error status — still fall back, but surface it.
      return { data: mockFactory(), source: "mock", error: `Backend error: ${err.message}` };
    }
    return { data: mockFactory(), source: "mock", error: null };
  }
}

export async function analyzeResume(file) {
  const form = new FormData();
  form.append("resume", file);
  return withFallback(
    () => request("/api/skills/analyze", { method: "POST", body: form }),
    () => mockAnalyzeSkills({ candidateName: file?.name?.split(".")[0] || "Candidate" })
  );
}

export async function submitManualSkills(payload) {
  return withFallback(
    () =>
      request("/api/skills/manual", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    () => mockAnalyzeSkills({ yearsOfBreak: payload?.yearsOfBreak })
  );
}

export async function getSandbox(profileId) {
  return withFallback(
    () => request(`/api/sandbox?profileId=${encodeURIComponent(profileId)}`),
    () => mockGenerateSandbox(),
    700
  );
}

export async function updateSandboxProgress(sandboxId, taskId, done) {
  return withFallback(
    () =>
      request("/api/sandbox/progress", {
        method: "POST",
        body: JSON.stringify({ sandboxId, taskId, done }),
      }),
    () => ({ ok: true }),
    150
  );
}

export async function completeSandbox(sandboxId) {
  return withFallback(
    () => request("/api/sandbox/complete", { method: "POST", body: JSON.stringify({ sandboxId }) }),
    () => mockProofOfWork(),
    900
  );
}

export async function getMatches(profileId) {
  return withFallback(
    () => request(`/api/matches?profileId=${encodeURIComponent(profileId)}`),
    () => ({ returnships: SAMPLE_RETURNSHIPS, schemes: SAMPLE_SCHEMES }),
    600
  );
}

export async function getMentors(domain) {
  return withFallback(
    () => request(`/api/mentors?domain=${encodeURIComponent(domain || "")}`),
    () => SAMPLE_MENTORS,
    500
  );
}

export async function bookMentorSlot(mentorId, slotId) {
  return withFallback(
    () =>
      request("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ mentorId, slotId }),
      }),
    () => ({ bookingId: `bk_${Math.random().toString(36).slice(2, 8)}`, status: "pending" }),
    400
  );
}
