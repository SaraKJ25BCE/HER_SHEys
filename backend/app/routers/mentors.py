"""Mentor matching + booking — Person 2."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class BookingInput(BaseModel):
    mentorId: str
    slotId: str


@router.get("/api/mentors")
async def get_mentors(domain: str = ""):
    # TODO(Person 2): score sample mentors against the candidate's target domain.
    return []


@router.post("/api/bookings")
async def create_booking(payload: BookingInput):
    # TODO(Person 2): persist the booking.
    return {"bookingId": "bk_placeholder", "status": "pending"}


@router.get("/api/bookings")
async def list_bookings():
    # TODO(Person 2): return the candidate's bookings.
    return []
