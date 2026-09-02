"""
Reentry backend — FastAPI skeleton.

Every route below returns a placeholder response shaped exactly like what the
frontend already expects (see ../../docs/API_CONTRACT.md). Replace each stub's
body with real logic; the frontend needs no changes as long as the shape holds.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import skills, sandbox, matches, mentors

app = FastAPI(title="Reentry API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(skills.router, prefix="/api/skills", tags=["skills"])
app.include_router(sandbox.router, prefix="/api/sandbox", tags=["sandbox"])
app.include_router(matches.router, prefix="/api/matches", tags=["matches"])
app.include_router(mentors.router, tags=["mentors"])


@app.get("/health")
def health():
    return {"status": "ok"}
