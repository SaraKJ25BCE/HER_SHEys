# Backend (stub)

FastAPI skeleton wired up so the routes match exactly what `frontend/lib/api.js`
already calls — see `../docs/API_CONTRACT.md` for the full request/response shapes.

Every route currently returns a placeholder response with the right shape. Replace
the body of each route (in `app/routers/`) with real logic:

- `routers/skills.py` — Person 3: résumé parsing + GenAI skill-gap analysis
- `routers/sandbox.py` — Person 3: Micro-Returnship Sandbox generation + proof-of-work
- `routers/matches.py` — Person 2: returnship / scheme matching logic + sample data
- `routers/mentors.py` — Person 2: mentor matching + booking persistence

## Run it

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Then point the frontend at it: in `frontend/.env.local`, set
`NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`. The frontend will automatically
switch from mock data to these live responses — no frontend changes required as
long as the response shape doesn't change.

CORS is already open to `http://localhost:3000` in `app/main.py`.
