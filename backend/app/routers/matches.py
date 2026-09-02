"""Returnship + government scheme matching — Person 2."""

from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def get_matches(profileId: str):
    # TODO(Person 2): score sample returnships/schemes against the skill profile.
    return {"returnships": [], "schemes": []}
