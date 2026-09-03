import os
import sys
import json
from datetime import date, datetime, timedelta
import requests
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env file
load_dotenv()

# Retrieve API Keys securely from environment
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")

if not GROQ_API_KEY:
    print("[!] Warning: GROQ_API_KEY is missing from environment or .env file.")

groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


def sanitize_filename(name: str) -> str:
    return "".join(c if c.isalnum() or c in ("-", "_") else "_" for c in name.strip().lower())


def get_progress_filepath(skill: str) -> str:
    return f"progress_{sanitize_filename(skill)}_5days.json"


def fetch_youtube_video(query: str) -> dict:
    """Uses the YouTube Data API v3 to fetch the top real tutorial video."""
    if not YOUTUBE_API_KEY:
        fallback_query = query.replace(" ", "+")
        return {
            "title": f"Tutorial: {query}",
            "channel": "YouTube Search",
            "url": f"https://www.youtube.com/results?search_query={fallback_query}"
        }

    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": 1,
        "key": YOUTUBE_API_KEY
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            items = response.json().get("items", [])
            if items:
                video_id = items[0]["id"]["videoId"]
                title = items[0]["snippet"]["title"]
                channel = items[0]["snippet"]["channelTitle"]
                return {
                    "title": title,
                    "channel": channel,
                    "url": f"https://www.youtube.com/watch?v={video_id}"
                }
    except Exception:
        pass

    # Fallback to direct search URL if quota or network fails
    fallback_query = query.replace(" ", "+")
    return {
        "title": f"Tutorial: {query}",
        "channel": "YouTube Search",
        "url": f"https://www.youtube.com/results?search_query={fallback_query}"
    }


def generate_roadmap_data(skill: str) -> dict:
    print(f"\n[+] Requesting 5-day project sprint for '{skill}' from Groq (llama-3.3-70b-versatile)...")

    prompt = f"""You are a principal engineer. Design an intensive 5-day build roadmap to master: "{skill}".
The user must produce ONE concrete portfolio-ready capstone project built sequentially across these 5 days.

Respond ONLY with valid JSON conforming strictly to this schema:
{{
  "skill": "{skill}",
  "capstone_project": "Exact Project Name",
  "project_description": "2-3 sentences explaining what the application does and why it proves competency.",
  "target_roles": [
    "Frontend Developer",
    "Full-Stack Engineer",
    "React Developer"
  ],
  "days": [
    {{
      "day": 1,
      "topic": "Topic Name",
      "goal": "Specific implementation objective for this day's code.",
      "youtube_query": "Targeted tutorial search term (e.g. react usestate and forms tutorial)"
    }},
    {{
      "day": 2,
      "topic": "Topic Name",
      "goal": "Specific implementation objective for this day's code.",
      "youtube_query": "Targeted tutorial search term"
    }},
    {{
      "day": 3,
      "topic": "Topic Name",
      "goal": "Specific implementation objective for this day's code.",
      "youtube_query": "Targeted tutorial search term"
    }},
    {{
      "day": 4,
      "topic": "Topic Name",
      "goal": "Specific implementation objective for this day's code.",
      "youtube_query": "Targeted tutorial search term"
    }},
    {{
      "day": 5,
      "topic": "Topic Name",
      "goal": "Specific implementation objective for this day's code.",
      "youtube_query": "Targeted tutorial search term"
    }}
  ]
}}

Ensure there are exactly 5 entries in "days" numbered 1 to 5. Return pure JSON only.
"""

    if not groq_client:
        print("[!] Error: Cannot invoke Groq API without GROQ_API_KEY in environment.")
        sys.exit(1)

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a tech mentor that outputs strict raw JSON only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        data = json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"\n[!] Primary model error ({e}). Attempting fallback to 'llama-3.1-8b-instant'...")
        try:
            completion = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are a tech mentor that outputs strict raw JSON only."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            data = json.loads(completion.choices[0].message.content)
        except Exception as fallback_err:
            print(f"\n[!] Groq generation failed: {fallback_err}")
            sys.exit(1)

    print("[+] Querying YouTube API for top matching tutorial videos...")
    for day_item in data.get("days", []):
        search_term = day_item.get("youtube_query", f"{skill} {day_item['topic']}")
        video_meta = fetch_youtube_video(search_term)
        day_item["video_title"] = video_meta["title"]
        day_item["video_channel"] = video_meta["channel"]
        day_item["resource_url"] = video_meta["url"]
        day_item["completed"] = False
        day_item["completed_at"] = None

    data["streak"] = 0
    data["last_completed_date"] = None
    return data


def save_progress(filepath: str, data: dict):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def load_progress(filepath: str) -> dict:
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def update_streak(data: dict):
    today = date.today().isoformat()
    last = data.get("last_completed_date")

    if last is None:
        data["streak"] = 1
        data["last_completed_date"] = today
        return

    last_dt = datetime.strptime(last, "%Y-%m-%d").date()
    today_dt = date.today()

    if last_dt == today_dt:
        return
    elif last_dt == today_dt - timedelta(days=1):
        data["streak"] += 1
        data["last_completed_date"] = today
    else:
        data["streak"] = 1
        data["last_completed_date"] = today


def display_dashboard(data: dict):
    os.system("cls" if os.name == "nt" else "clear")
    skill = data.get("skill", "Curriculum").upper()
    streak = data.get("streak", 0)
    days = data.get("days", [])
    completed_count = sum(1 for d in days if d.get("completed"))
    percent = int((completed_count / len(days)) * 100) if days else 0

    print("=" * 90)
    print(f"   TRACKER: {skill} 5-DAY PROJECT SPRINT")
    print(f"   Streak: {streak} Day{'s' if streak != 1 else ''} 🔥 | Progress: {completed_count}/5 ({percent}%)")
    print("=" * 90)

    print(f"\n📦 CAPSTONE PROJECT: {data.get('capstone_project')}")
    if data.get("project_description"):
        print(f"   {data['project_description']}")

    print("\n🎯 TARGET ROLES TO APPLY FOR:")
    for role in data.get("target_roles", []):
        print(f"  • {role}")

    print("\n📅 5-DAY BUILD SCHEDULE & YOUTUBE TUTORIALS:")
    for d in days:
        box = "[✔]" if d.get("completed") else "[ ]"
        print(f"\n  {box} Day {d['day']}: {d['topic']}")
        print(f"        Goal : {d['goal']}")
        print(f"        Video: {d.get('video_title')} ({d.get('video_channel')})")
        print(f"        Link : {d['resource_url']}")

    print("\n" + "-" * 90)


def main():
    skill = input("What skill do you want to build with? (e.g. React Hooks): ").strip()
    if not skill:
        print("Skill cannot be empty.")
        return

    filepath = get_progress_filepath(skill)

    if os.path.exists(filepath):
        print(f"\n[+] Loading saved project sprint from '{filepath}'...")
        data = load_progress(filepath)
    else:
        data = generate_roadmap_data(skill)
        save_progress(filepath, data)

    while True:
        display_dashboard(data)
        print("Commands:")
        print("  • Type day number (1-5) to toggle completion [✔].")
        print("  • Type 'reset' to uncheck all days.")
        print("  • Type 'exit' to save and close.")
        choice = input("\nYour action: ").strip().lower()

        if choice == "exit":
            print("\nProgress saved. Keep building!")
            break
        elif choice == "reset":
            for d in data.get("days", []):
                d["completed"] = False
                d["completed_at"] = None
            data["streak"] = 0
            data["last_completed_date"] = None
            save_progress(filepath, data)
        elif choice.isdigit():
            day_num = int(choice)
            matching = [d for d in data.get("days", []) if d["day"] == day_num]
            if matching:
                item = matching[0]
                item["completed"] = not item["completed"]
                if item["completed"]:
                    item["completed_at"] = datetime.now().isoformat()
                    update_streak(data)
                else:
                    item["completed_at"] = None
                save_progress(filepath, data)
            else:
                input("Invalid day number (choose 1-5)! Press Enter...")
        else:
            input("Invalid command! Press Enter...")


if __name__ == "__main__":
    main()