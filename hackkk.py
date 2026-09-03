import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

# 1. Load API key securely
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
        print(f"⚠️ JSON Parse Warning: {e}. Utilizing fallback data.")
        return default_fallback


def process_full_returnee_pipeline(resume_text: str, target_role: str, user_degree: str, age: int, has_phd: bool) -> dict:
    """
    Executes resume parsing, DST scheme matching, quiz generation, and 5-day project creation
    in a SINGLE Gemini API pass to minimize latency.
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
    
    fallback = {
        "candidate_profile": {
            "existing_skills": ["SQL", "Data Analysis"],
            "missing_skills_for_target": ["Python", "Apache Spark", "Git"],
            "youtube_search_queries": ["Python Data Engineering tutorial", "Apache Spark crash course"]
        },
        "matched_scheme": {
            "matched_scheme": "WISE-PhD",
            "reason": "Eligible based on age range and holding a Post-Graduate degree in STEM."
        },
        "generated_quiz": [
            {
                "question": "What is Apache Spark primary use case?",
                "options": ["Distributed Data Processing", "CSS Styling", "DNS Lookup", "Video Editing"],
                "correct_answer": "A"
            }
        ],
        "micro_returnship_sandbox": [
            {
                "day": 1,
                "title": "Day 1: Setup & Python Basics",
                "objective": "Configure environment and verify pipeline data.",
                "task_description": "Set up VS Code, install dependencies, and write basic data processing scripts.",
                "github_deliverable": "day_1_setup.py"
            }
        ]
    }

    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json")
    )
    return safe_json_parse(response.text, fallback)


if __name__ == "__main__":
    sample_resume = "4 years experience as SQL Analyst. Master of Science degree."
    target = "Data Engineer"
    
    print("--- Running High-Speed AI Pipeline ---")
    output = process_full_returnee_pipeline(sample_resume, target, "M.Sc", 32, False)

    with open("output.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4)
        
    print(" Output successfully saved to output.json!")