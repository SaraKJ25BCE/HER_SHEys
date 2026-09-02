# API Contract — Frontend ⇄ Backend

The frontend calls every endpoint below via `frontend/lib/api.js`. Each function there **already
falls back to mock data on failure**, so the frontend runs standalone. When backend implements a
route, the frontend picks it up automatically — no frontend changes needed as long as the response
shape matches.

Base URL comes from `NEXT_PUBLIC_API_BASE_URL` (see `frontend/.env.local.example`), default
`http://localhost:8000`.

---

### `POST /api/skills/analyze`
Multipart form upload of a résumé (PDF/DOCX). GenAI extracts + evaluates current skills.

**Request:** `multipart/form-data` — field `resume` (file)

**Response `200`:**
```json
{
  "profileId": "prof_8f2c",
  "candidateName": "Ananya Rao",
  "yearsOfBreak": 4,
  "legacySkills": [
    { "skill": "SQL", "level": 70 },
    { "skill": "Excel / VBA", "level": 80 },
    { "skill": "Python (basic)", "level": 40 }
  ],
  "marketSkills": [
    { "skill": "SQL", "level": 70, "targetLevel": 85 },
    { "skill": "Snowflake", "level": 0, "targetLevel": 75 },
    { "skill": "GenAI APIs", "level": 0, "targetLevel": 70 },
    { "skill": "Python", "level": 40, "targetLevel": 75 }
  ],
  "gapSummary": "Strong SQL foundation; core gap is cloud data warehousing and applied GenAI tooling."
}
```

### `POST /api/skills/manual`
Same response shape as above, built from a manual form instead of a résumé.

**Request:**
```json
{ "pastRole": "Data Analyst", "stack": ["SQL", "Excel"], "yearsOfBreak": 4, "targetDomain": "Data & AI" }
```

---

### `GET /api/sandbox?profileId=prof_8f2c`
Returns the generated 5-day Micro-Returnship Sandbox.

**Response `200`:**
```json
{
  "sandboxId": "sbx_44a1",
  "title": "SQL + Excel → Snowflake + GenAI APIs",
  "targetReturnship": "Data Analyst Returnship — FinEdge Analytics",
  "days": [
    {
      "day": 1,
      "title": "Reconnect: SQL, reframed",
      "markdown": "You already know JOINs and GROUP BY...",
      "tasks": [
        { "id": "d1t1", "label": "Set up a free Snowflake trial account", "done": false },
        { "id": "d1t2", "label": "Run your first warehouse query", "done": false }
      ]
    }
  ],
  "proofOfWorkSummary": null
}
```

### `POST /api/sandbox/progress`
**Request:** `{ "sandboxId": "sbx_44a1", "taskId": "d1t2", "done": true }`
**Response:** `{ "ok": true }`

### `POST /api/sandbox/complete`
Generates the Day-5 proof-of-work paragraph + skill tags once all tasks are done.
**Request:** `{ "sandboxId": "sbx_44a1" }`
**Response:** `{ "proofOfWorkSummary": "...", "skillTags": ["Snowflake", "GenAI APIs", "SQL"] }`

---

### `GET /api/matches?profileId=prof_8f2c`
**Response `200`:**
```json
{
  "returnships": [
    {
      "id": "rt_01", "title": "Data Analyst Returnship", "company": "FinEdge Analytics",
      "location": "Bengaluru (Hybrid)", "matchScore": 88,
      "matchReason": "Matched because you completed the Snowflake + GenAI sandbox.",
      "stack": ["SQL", "Snowflake", "GenAI APIs"]
    }
  ],
  "schemes": [
    {
      "id": "sch_01", "name": "WISE-KIRAN", "provider": "DST, Govt. of India",
      "eligibility": "Women with a career break, S&T background",
      "benefit": "Fellowship + research re-entry support",
      "matchScore": 91, "link": "https://dst.gov.in"
    }
  ]
}
```

---

### `GET /api/mentors?domain=Data%20%26%20AI`
**Response `200`:** array of mentors with `id, name, role, company, expertiseTags, bio, matchScore, availability: [{slotId, date, time}]`

### `POST /api/bookings`
**Request:** `{ "mentorId": "m_03", "slotId": "slot_12" }`
**Response:** `{ "bookingId": "bk_09", "status": "pending" }`

### `GET /api/bookings`
Returns the candidate's bookings with `status: "pending" | "confirmed" | "completed"`.

### `PATCH /api/bookings/:id`
**Request:** `{ "status": "confirmed" }` — used by the mentor side / admin, included for completeness.

---

## Auth
Frontend generates a client-side session token (`lib/session.js`, `crypto.randomUUID()`) and sends
it as `Authorization: Bearer <token>` on every request once a profile exists. Backend can swap this
for real auth later without any frontend contract change.
