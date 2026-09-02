# Reentry — AI Career Re-Entry & Mentorship Platform for Women in STEM

Built for the **AI Career Re-Entry & Mentorship Platform** problem statement (Innovator Track).

USP: the **Confidence-to-Code Bridge** — instead of listing skill gaps, we generate a personalized
5-day **Micro-Returnship Sandbox** that bridges a candidate's legacy stack (e.g. SQL + Excel, 2018)
to the current stack for their target returnship (e.g. SQL + Snowflake + GenAI APIs), producing a
proof-of-work summary that feeds directly into returnship, scheme, and mentor matching.

## Team split

| Area | Owner | Status in this repo |
|---|---|---|
| Frontend & UX (intake, dashboard, sandbox UI, booking flow) | Person 1 | ✅ Built (this delivery) |
| Backend API (FastAPI, matching logic, scheme/returnship data) | Person 2 | 🔧 Stub contract in `backend/` — ready to implement against |
| GenAI (resume parsing, skill-gap analysis, sandbox generation) | Person 3 | 🔧 Hook points documented in `docs/API_CONTRACT.md` |

## Repo structure

```
career-reentry-platform/
├── frontend/          Next.js 14 app (App Router) — fully working UI, ships with mock-data fallback
├── backend/           FastAPI skeleton — routes stubbed to match frontend's expected contract
├── docs/
│   └── API_CONTRACT.md   The exact request/response shapes the frontend already calls
└── README.md
```

## Running the frontend

The frontend works **standalone**, with no backend running — every API call in `lib/api.js`
automatically falls back to realistic mock data (sample returnships, WISE-KIRAN / Women Scientist
Scheme entries, mentor profiles, a generated 5-day sandbox) if the backend isn't reachable. That
means it's demo-safe even mid-hackathon while the backend/AI pieces are still being wired up.

```bash
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_BASE_URL once backend is up
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Running the backend (stub)

bash
### PowerShell

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### CMD

```cmd
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The stub already returns shaped-correctly placeholder JSON for every endpoint the frontend calls,
so Person 2/3 can implement the real logic (matching, resume parsing, GenAI sandbox generation)
one endpoint at a time without ever breaking the frontend.

## Demo flow (what judges will click through)

1. **Intake** — upload a résumé (PDF/DOCX) or fill the manual skills form
2. **Dashboard** — Legacy Skills vs. 2026 Market Skills chart, generated skill-gap summary
3. **Sandbox** — the 5-day Micro-Returnship project: markdown tasks, checklists, daily milestone
   tracker, progress bar, and a generated "proof-of-work" summary at Day 5
4. **Matches** — returnships + government schemes scored against the (now updated) skill profile,
   explicitly showing *why* — e.g. "Matched because you completed the Snowflake + GenAI sandbox"
5. **Mentorship** — matched mentor list → calendar booking flow → status tracker
   (Pending → Confirmed → Completed)

See `docs/API_CONTRACT.md` for the full endpoint list and payload shapes.
