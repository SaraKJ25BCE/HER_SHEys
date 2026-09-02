"""Skill assessment endpoints — Person 3 (GenAI resume parsing + gap analysis)."""

from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

router = APIRouter()


class ManualSkillsInput(BaseModel):
    pastRole: str
    stack: list[str]
    yearsOfBreak: int
    targetDomain: str


def _placeholder_profile(candidate_name: str, years_of_break: int):
    # TODO(Person 3): replace with real GenAI resume parsing / gap analysis.
    return {
        "profileId": "prof_placeholder",
        "candidateName": candidate_name,
        "yearsOfBreak": years_of_break,
        "legacySkills": [{"skill": "SQL", "level": 70}],
        "marketSkills": [{"skill": "SQL", "level": 70, "targetLevel": 85}],
        "gapSummary": "TODO: generate this with your GenAI pipeline.",
    }


@router.post("/analyze")
async def analyze_resume(resume: UploadFile = File(...)):
    # TODO(Person 3): parse resume.file (PDF/DOCX) and run GenAI skill extraction.
    return _placeholder_profile(candidate_name=resume.filename or "Candidate", years_of_break=0)


@router.post("/manual")
async def submit_manual_skills(payload: ManualSkillsInput):
    # TODO(Person 3): run GenAI gap analysis against payload.stack / targetDomain.
    return _placeholder_profile(candidate_name="Candidate", years_of_break=payload.yearsOfBreak)
