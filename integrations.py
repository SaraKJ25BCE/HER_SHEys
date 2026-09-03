# integrations.py
import os
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build

load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST", "jsearch.p.rapidapi.com")
GOOGLE_CALENDAR_ID = os.getenv("GOOGLE_CALENDAR_ID", "primary")
CREDENTIALS_FILE = "google_credentials.json"

# --- 1. JSEARCH REAL-TIME JOBS API ---
def fetch_realtime_jobs(target_role: str, skill_gap: str = "", location: str = "India") -> list:
    """
    Fetches live, real-time job listings matching target role and skill gap via JSearch API.
    """
    if not RAPIDAPI_KEY:
        print("⚠️ Warning: RAPIDAPI_KEY missing. Returning empty job list.")
        return []

    query = f"{target_role} {skill_gap} in {location}".strip()
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
        if response.status_code == 200:
            results = response.json().get("data", [])
            jobs = []
            for item in results[:3]:  # Top 3 listings
                jobs.append({
                    "id": item.get("job_id"),
                    "title": item.get("job_title"),
                    "company": item.get("employer_name"),
                    "location": f"{item.get('job_city', '')}, {item.get('job_country', '')}".strip(", "),
                    "apply_link": item.get("job_apply_link"),
                    "employment_type": item.get("job_employment_type", "Full-Time")
                })
            return jobs
    except Exception as e:
        print(f"❌ JSearch API Error: {e}")

    return []


# --- 2. GOOGLE CALENDAR SCHEDULING API ---
def schedule_calendar_meeting(mentor_name: str, mentor_role: str, user_email: str = "candidate@example.com") -> dict:
    """
    Schedules a real meeting event on Google Calendar using Service Account authentication.
    """
    if not os.path.exists(CREDENTIALS_FILE):
        return {
            "status": "mock",
            "message": f"Calendar credentials file missing. Mock meeting with {mentor_name} logged."
        }

    try:
        scopes = ["https://www.googleapis.com/auth/calendar"]
        creds = service_account.Credentials.from_service_account_file(
            CREDENTIALS_FILE, scopes=scopes
        )
        service = build("calendar", "v3", credentials=creds)

        # Schedule meeting for tomorrow at 10:00 AM IST
        start_time = (datetime.now() + timedelta(days=1)).replace(hour=10, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(minutes=45)

        event = {
            'summary': f'Re-STEM Mentorship Session: {mentor_name}',
            'description': f'1-on-1 mentorship session with {mentor_name} ({mentor_role}) regarding STEM career re-entry.',
            'start': {
                'dateTime': start_time.isoformat() + '+05:30',
                'timeZone': 'Asia/Kolkata',
            },
            'end': {
                'dateTime': end_time.isoformat() + '+05:30',
                'timeZone': 'Asia/Kolkata',
            },
            'attendees': [
                {'email': user_email},
            ],
        }

        created_event = service.events().insert(calendarId=GOOGLE_CALENDAR_ID, body=event).execute()
        return {
            "status": "success",
            "event_link": created_event.get("htmlLink"),
            "start_time": start_time.strftime("%A, %b %d at %I:%M %p IST")
        }
    except Exception as e:
        print(f"❌ Google Calendar API Error: {e}")
        return {
            "status": "error",
            "message": str(e)
        }