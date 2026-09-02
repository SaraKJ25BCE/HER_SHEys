"""Micro-Returnship Sandbox endpoints — Person 3 (GenAI sandbox generation)."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ProgressInput(BaseModel):
    sandboxId: str
    taskId: str
    done: bool


class CompleteInput(BaseModel):
    sandboxId: str


@router.get("")
async def get_sandbox(profileId: str):
    # TODO(Person 3): generate a real 5-day sandbox from the skill profile.
    return {
        "sandboxId": "sbx_placeholder",
        "title": "TODO: generated sandbox title",
        "targetReturnship": "TODO",
        "days": [],
        "proofOfWorkSummary": None,
    }


@router.post("/progress")
async def update_progress(payload: ProgressInput):
    # TODO(Person 2): persist task completion.
    return {"ok": True}


@router.post("/complete")
async def complete_sandbox(payload: CompleteInput):
    # TODO(Person 3): generate the proof-of-work paragraph + skill tags.
    return {"proofOfWorkSummary": "TODO", "skillTags": []}
