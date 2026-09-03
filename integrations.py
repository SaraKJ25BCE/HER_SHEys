import os
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from market_mapper import get_emerging_market_role

load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST", "jsearch.p.rapidapi.com")
GOOGLE_CALENDAR_ID = os.getenv("GOOGLE_CALENDAR_ID", "primary")
CREDENTIALS_FILE = "google_credentials.json"


# --- JSEARCH EXECUTION HELPER ---
def execute_jsearch_query(query: str) -> list:
    """
    Executes a search query against JSearch API via RapidAPI.
    """
    if not RAPIDAPI_KEY:
        print("⚠️ Warning: RAPIDAPI_KEY missing from environment.")
        return []

    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
    }
    params = {
        "query": query,
        "page": "1",
        "num_pages": "1",
        "date_posted": "all"
    }

    try:
        response = requests.get(url, headers=headers, params=params, timeout=8)
        print(f"🔍 JSearch API Response Code for '{query}': {response.status_code}")
        if response.status_code == 200:
            results = response.json().get("data", [])
            print(f"✅ Found {len(results)} jobs for '{query}'")
            jobs = []
            for item in results[:3]:
                jobs.append({
                    "id": item.get("job_id"),
                    "title": item.get("job_title"),
                    "company": item.get("employer_name"),
                    "location": f"{item.get('job_city', '')}, {item.get('job_country', '')}".strip(", "),
                    "apply_link": item.get("job_apply_link"),
                    "employment_type": item.get("job_employment_type", "Full-Time")
                })
            return jobs
        else:
            print(f"❌ JSearch Request Failed: {response.text}")
    except Exception as e:
        print(f"❌ JSearch Request Exception: {e}")

    return []


# --- SINGLE ROLE FETCH WITH QUERY FALLBACK ---
def fetch_realtime_jobs(target_role: str, skill_gap: str = "", location: str = "India") -> list:
    """
    Fetches real-time job listings with fallback query broadening.
    """
    if not RAPIDAPI_KEY:
        return []

    # Attempt 1: Target Role + Skill Gap (Specific)
    query = f"{target_role} {skill_gap} in {location}".strip()
    jobs = execute_jsearch_query(query)

    # Attempt 2: Fallback to Target Role only (Broad)
    if not jobs:
        print(f"⚠️ 0 results for '{query}'. Retrying broader query...")
        query = f"{target_role} in {location}"
        jobs = execute_jsearch_query(query)

    return jobs


# --- DUAL-ENGINE JOB FETCHING (Target vs Modern High-Demand Roles) ---
def fetch_dual_engine_jobs(target_role: str, skill_gap: str = "", location: str = "India") -> dict:
    """
    Fetches both standard target role listings AND modern high-demand emerging role listings.
    """
    # 1. Fetch Baseline Target Role Jobs
    target_jobs = fetch_realtime_jobs(target_role=target_role, skill_gap=skill_gap, location=location)

    # 2. Fetch Emerging High-Demand Market Role Jobs
    emerging_info = get_emerging_market_role(target_role)
    emerging_title = emerging_info["emerging_title"]
    emerging_query = emerging_info["market_query"]

    emerging_jobs = fetch_realtime_jobs(target_role=emerging_query, skill_gap="", location=location)

    # 3. Safe Demo Fallback if API keys are absent or exhausted
    if not target_jobs:
        target_jobs = [
            {
                "id": "ret_1",
                "title": f"{target_role} Returnship — Diversity Program",
                "company": "TechCorp Diversity Program",
                "location": "Hybrid / Remote (India)",
                "apply_link": "https://www.linkedin.com/jobs",
                "employment_type": "6 Months (Convertible to Full-Time)"
            }
        ]

    if not emerging_jobs:
        emerging_jobs = [
            {
                "id": "em_1",
                "title": f"Senior {emerging_title}",
                "company": "CloudScale AI Systems",
                "location": "Remote (India)",
                "apply_link": "https://www.google.com/about/careers",
                "employment_type": "Full-Time Re-Entry Track"
            }
        ]

    return {
        "target_role_jobs": target_jobs,
        "emerging_market_title": emerging_title,
        "emerging_jobs": emerging_jobs
    }


# --- GOOGLE CALENDAR SCHEDULING ---
def schedule_calendar_meeting(mentor_name: str, mentor_role: str, user_email: str = "candidate@example.com") -> dict:
    """
    Schedules a meeting event on Google Calendar using Service Account authentication.
    """
    if not os.path.exists(CREDENTIALS_FILE):
        return {
            "status": "mock",
            "message": f"Calendar credentials file missing. Demo session request logged for {mentor_name}."
        }

    try:
        scopes = ["https://www.googleapis.com/auth/calendar"]
        creds = service_account.Credentials.from_service_account_file(
            CREDENTIALS_FILE, scopes=scopes
        )
        service = build("calendar", "v3", credentials=creds)

        start_time = (datetime.now() + timedelta(days=1)).replace(hour=10, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(minutes=45)

        event = {
            'summary': f'Re-STEM Mentorship Session: {mentor_name}',
            'description': f'1-on-1 session with {mentor_name} ({mentor_role}) regarding STEM career re-entry.',
            'start': {
                'dateTime': start_time.isoformat() + '+05:30',
                'timeZone': 'Asia/Kolkata',
            },
            'end': {
                'dateTime': end_time.isoformat() + '+05:30',
                'timeZone': 'Asia/Kolkata',
            },
            'attendees': [{'email': user_email}],
        }

        created_event = service.events().insert(calendarId=GOOGLE_CALENDAR_ID, body=event).execute()
        return {
            "status": "success",
            "event_link": created_event.get("htmlLink"),
            "start_time": start_time.strftime("%A, %b %d at %I:%M %p IST")
        }
    except Exception as e:
        print(f"❌ Google Calendar Error: {e}")
        return {"status": "error", "message": str(e)}