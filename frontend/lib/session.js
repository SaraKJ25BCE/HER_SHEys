// Client-side session token, persisted to localStorage.
// Backend can later swap this for real auth without changing the frontend contract —
// see docs/API_CONTRACT.md.

const TOKEN_KEY = "reentry_session_token";
const PROFILE_KEY = "reentry_profile_id";

export function getOrCreateToken() {
  if (typeof window === "undefined") return null;
  let token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `tok_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

export function getStoredProfileId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PROFILE_KEY);
}

export function setStoredProfileId(profileId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, profileId);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(PROFILE_KEY);
}
