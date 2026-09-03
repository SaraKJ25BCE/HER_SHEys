from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import traceback

from api_adapter import process_returnee_profile
from data import MENTORS_DB
from integrations import fetch_dual_engine_jobs, schedule_calendar_meeting

app = FastAPI(title="Re-STEM API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserProfileRequest(BaseModel):
    resume_text: str
    target_role: str
    degree: str
    age: int
    has_phd: bool

class ScheduleMeetingRequest(BaseModel):
    mentor_name: str
    mentor_role: str
    user_email: str = "candidate@example.com"

@app.get("/")
def home():
    return {"status": "Re-STEM Backend API is running!"}

@app.post("/api/analyze")
def analyze_profile(user: UserProfileRequest):
    try:
        # 1. Execute single-pass AI analysis pipeline
        ai_results = process_returnee_profile(
            resume_text=user.resume_text,
            target_role=user.target_role,
            degree=user.degree,
            age=user.age,
            has_phd=user.has_phd
        )
        
        # 2. Extract top missing skill gap
        candidate = ai_results.get("candidate_profile", {}) if isinstance(ai_results, dict) else {}
        gaps = candidate.get("missing_skills_for_target", [])
        top_gap = gaps[0] if gaps else ""

        # 3. Fetch Dual-Engine Jobs (Target Role + Emerging High-Demand Role)
        dual_jobs = fetch_dual_engine_jobs(target_role=user.target_role, skill_gap=top_gap)

        return {
            "ai_pipeline": ai_results,
            "matched_returnships": dual_jobs.get("target_role_jobs", []),
            "emerging_market_title": dual_jobs.get("emerging_market_title", "Emerging Modern Role"),
            "emerging_jobs": dual_jobs.get("emerging_jobs", []),
            "matched_mentors": MENTORS_DB
        }
    except Exception as e:
        print("❌ DETAILED BACKEND TRACEBACK:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Exception: {str(e)}")

@app.post("/api/schedule-meeting")
def schedule_meeting(req: ScheduleMeetingRequest):
    try:
        result = schedule_calendar_meeting(req.mentor_name, req.mentor_role, req.user_email)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))