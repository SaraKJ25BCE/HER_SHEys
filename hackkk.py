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

# Ground-truth market benchmark skills (Can be updated dynamically by Person 3)
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


def parse_resume(resume_text: str, target_role: str) -> dict:
    """
    Parses candidate resume against current market benchmark skills.
    """
    benchmark_skills = MARKET_BENCHMARKS.get(target_role, ["Python", "SQL", "Git", "Cloud Infrastructure"])
    
    prompt = f"""
    Analyze this resume for a professional returning to work in STEM:
    Resume: {resume_text}
    Target Role: {target_role}
    Current Ground-Truth In-Demand Skills for {target_role}: {benchmark_skills}

    1. Extract skills the applicant already possesses.
    2. Compare their profile against the provided 'Current Ground-Truth In-Demand Skills' to identify exact missing skill gaps.
    3. Generate explicit YouTube search queries for those missing skills.

    Return a valid JSON object strictly matching this schema:
    {{
        "existing_skills": ["list of current skills"],
        "missing_skills_for_target": ["list of missing skills from the benchmark"],
        "youtube_search_queries": ["search query for skill gap 1", "search query for skill gap 2"]
    }}
    """
    fallback = {
        "existing_skills": ["SQL", "Data Analysis"],
        "missing_skills_for_target": ["Python", "Apache Spark", "Git"],
        "youtube_search_queries": ["Python for Data Engineering tutorial", "Apache Spark crash course"]
    }
    
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )
    return safe_json_parse(response.text, fallback)


def generate_quiz(topic: str) -> list:
    """
    Generates a 3-question conceptual quiz based on a skill topic.
    """
    prompt = f"""
    Create a 3-question multiple-choice quiz testing core concepts of: {topic}.
    Return a valid JSON array strictly matching this schema:
    [
        {{
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option letter (e.g. A)"
        }}
    ]
    """
    fallback = [
        {
            "question": f"What is a primary concept in {topic}?",
            "options": ["Concept A", "Concept B", "Concept C", "Concept D"],
            "correct_answer": "A"
        }
    ]
    
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )
    return safe_json_parse(response.text, fallback)


def match_scheme(user_degree: str, age: int, has_phd: bool) -> dict:
    """
    Performs scheme eligibility matching using explicit rules (RAG Pattern).
    """
    dst_context = """
    WISE-PhD: Age 27-45, requires PG in Basic/Applied Sciences or B.Tech.
    WISE-PDF: Age 27-60, requires Ph.D. in STEM area.
    WISE-SCOPE: Age 27-60, requires Ph.D. in STEM area for societal lab-to-land projects.
    """
    
    prompt = f"""
    Using ONLY the rules listed below, determine which DST scheme the applicant qualifies for.
    Rules:
    {dst_context}

    Applicant Profile:
    - Degree: {user_degree}
    - Age: {age}
    - Has Ph.D.: {has_phd}

    If no scheme matches, set matched_scheme to "None".
    Return a valid JSON object strictly matching this schema:
    {{
        "matched_scheme": "Scheme Name or None",
        "reason": "1-sentence reason for eligibility or disqualification"
    }}
    """
    fallback = {
        "matched_scheme": "WISE-PhD",
        "reason": "Eligible based on age range and holding a Post-Graduate degree in STEM."
    }
    
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )
    return safe_json_parse(response.text, fallback)


if __name__ == "__main__":
    sample_resume = "4 years experience as SQL Analyst. Master of Science degree."
    target = "Data Engineer"
    
    print("--- Running AI & RAG Pipeline ---")
    parsed_data = parse_resume(sample_resume, target)
    quiz_data = generate_quiz(parsed_data["youtube_search_queries"][0])
    scheme_data = match_scheme(user_degree="M.Sc", age=32, has_phd=False)

    final_output = {
        "candidate_profile": parsed_data,
        "generated_quiz": quiz_data,
        "matched_scheme": scheme_data
    }

    with open("output.json", "w", encoding="utf-8") as f:
        json.dump(final_output, f, indent=4)
        
    print(" Output successfully saved to output.json!")