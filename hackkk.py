import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import APIError

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is missing! Check your .env file.")

client = genai.Client(api_key=api_key)
MODEL_ID = "gemini-3.6-flash"

# Ground-truth market benchmark skills
MARKET_BENCHMARKS = {
    "Data Engineer": ["Python", "SQL", "Apache Spark", "Snowflake", "dbt", "AWS S3/Redshift", "Git", "Docker"],
    "AI/ML Engineer": ["Python", "PyTorch", "HuggingFace", "LangChain/LlamaIndex", "Vector Databases", "MLOps", "REST APIs"],
    "Full Stack Engineer": ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "REST/GraphQL APIs", "Git"]
}


def safe_json_parse(raw_text: str, default_fallback: dict) -> dict:
    """
    Safely parses JSON responses from the LLM, stripping markdown code blocks
    and handling decoding errors gracefully.
    """
    try:
        clean_text = raw_text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text[7:]
        if clean_text.startswith("```"):
            clean_text = clean_text[3:]
        if clean_text.endswith("```"):
            clean_text = clean_text[:-3]
        return json.loads(clean_text.strip())
    except Exception as e:
        print(f"⚠️ JSON Parse Warning: {e}. Utilizing dynamic fallback data.")
        return default_fallback


def process_full_returnee_pipeline(resume_text: str, target_role: str, user_degree: str, age: int, has_phd: bool) -> dict:
    """
    Executes resume parsing, DST scheme matching, quiz generation, and 5-day project creation
    in a SINGLE Gemini API pass with fallback mechanisms for API rate limits.
    """
    benchmark_skills = MARKET_BENCHMARKS.get(target_role, ["Python", "SQL", "Git", "Cloud Infrastructure"])
    
    dst_context = """
    WISE-PhD: Age 27-45, requires PG in Basic/Applied Sciences or B.Tech.
    WISE-PDF: Age 27-60, requires Ph.D. in STEM area.
    WISE-SCOPE: Age 27-60, requires Ph.D. in STEM area for societal lab-to-land projects.
    """

    prompt = f"""
    Perform a complete career re-entry evaluation for this STEM returnee in ONE response.

    APPLICANT PROFILE:
    - Resume: {resume_text}
    - Target Role: {target_role}
    - Degree: {user_degree} | Age: {age} | Has Ph.D.: {has_phd}

    GROUND-TRUTH DATA:
    - Market Skills for {target_role}: {benchmark_skills}
    - DST Scheme Rules: {dst_context}

    INSTRUCTIONS:
    1. Extract existing skills and missing skill gaps based on market benchmarks.
    2. Generate 2 targeted YouTube search queries for missing skills.
    3. Determine DST scheme eligibility based strictly on the rules provided.
    4. Create a 3-question conceptual quiz on the top missing skill gap.
    5. Build a 5-day micro-returnship project sandbox (days 1 to 5).

    Return a valid JSON object matching this EXACT schema:
    {{
        "candidate_profile": {{
            "existing_skills": ["list of skills"],
            "missing_skills_for_target": ["list of skill gaps"],
            "youtube_search_queries": ["query 1", "query 2"]
        }},
        "matched_scheme": {{
            "matched_scheme": "Scheme Name or None",
            "reason": "1-sentence explanation"
        }},
        "generated_quiz": [
            {{
                "question": "Question text",
                "options": ["A", "B", "C", "D"],
                "correct_answer": "Option letter"
            }}
        ],
        "micro_returnship_sandbox": [
            {{
                "day": 1,
                "title": "Day Title",
                "objective": "Daily Goal",
                "task_description": "Instructions",
                "github_deliverable": "script.py"
            }}
        ]
    }}
    """
    
    # Dynamic fallback reacting directly to user inputs if Gemini endpoint fails
    fallback = {
        "candidate_profile": {
            "existing_skills": ["Python", "SQL", "Problem Solving"],
            "missing_skills_for_target": benchmark_skills[:3],
            "youtube_search_queries": [f"{benchmark_skills[0]} crash course", f"{target_role} roadmap tutorial"]
        },
        "matched_scheme": {
            "matched_scheme": "WISE-PhD" if (has_phd or user_degree in ["M.Sc", "Ph.D."]) else "WISE-SCOPE",
            "reason": f"Matched based on age {age} and degree {user_degree} for STEM re-entry."
        },
        "generated_quiz": [
            {
                "question": f"What is a primary requirement for a {target_role}?",
                "options": [benchmark_skills[0], "HTML Formatting", "Video Editing", "Graphic Design"],
                "correct_answer": "A"
            }
        ],
        "micro_returnship_sandbox": [
            {
                "day": 1,
                "title": f"Day 1: Setup & {benchmark_skills[0]} Foundations",
                "objective": f"Set up environment for {target_role} project.",
                "task_description": f"Configure VS Code and write initial test scripts for {benchmark_skills[0]}.",
                "github_deliverable": "day_1_setup.py"
            },
            {
                "day": 2,
                "title": f"Day 2: Core Implementation with {benchmark_skills[1] if len(benchmark_skills) > 1 else 'SQL'}",
                "objective": "Build operational backend logic.",
                "task_description": "Connect database/data pipeline and process core datasets.",
                "github_deliverable": "day_2_pipeline.py"
            },
            {
                "day": 3,
                "title": "Day 3: Model/API Integration",
                "objective": "Integrate key libraries and expose endpoints.",
                "task_description": "Create REST endpoint or pipeline script to process user inputs.",
                "github_deliverable": "day_3_api.py"
            },
            {
                "day": 4,
                "title": "Day 4: Unit Testing & Validation",
                "objective": "Validate project outputs and ensure code stability.",
                "task_description": "Write automated test cases using PyTest.",
                "github_deliverable": "test_pipeline.py"
            },
            {
                "day": 5,
                "title": "Day 5: Portfolio Deployment & GitHub Setup",
                "objective": "Prepare repository for returnship application submission.",
                "task_description": "Create comprehensive README.md and push final code to GitHub.",
                "github_deliverable": "README.md"
            }
        ]
    }

    # Execute single-pass inference with retry logic
    for attempt in range(2):
        try:
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            return safe_json_parse(response.text, fallback)
        except APIError as e:
            print(f"⚠️ Gemini API Warning (Attempt {attempt+1}): {e}. Retrying in 1s...")
            time.sleep(1)
        except Exception as e:
            print(f"⚠️ General Error: {e}. Utilizing fallback data.")
            break

    print("⚠️ Servicing dynamic fallback data to dashboard.")
    return fallback


if __name__ == "__main__":
    sample_resume = "4 years experience in Python and Scikit-Learn."
    target = "AI/ML Engineer"
    
    print("--- Running High-Speed Single Pass Engine ---")
    output = process_full_returnee_pipeline(sample_resume, target, "M.Tech", 31, False)

    with open("output.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4)
        
    print(" Output successfully saved to output.json!")