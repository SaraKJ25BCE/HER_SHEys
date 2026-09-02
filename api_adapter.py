# api_adapter.py
from hackkk import parse_resume, generate_quiz, match_scheme, safe_json_parse

def process_returnee_profile(resume_text: str, target_role: str, degree: str, age: int, has_phd: bool) -> dict:
    """
    Unified entry point for Person 3 (Backend/FastAPI) to invoke Person 2's AI pipeline.
    """
    # 1. Extract skills and missing gaps
    candidate_profile = parse_resume(resume_text, target_role)
    
    # 2. Pick top search query and generate knowledge check quiz
    top_query = candidate_profile.get("youtube_search_queries", ["Python tutorial"])[0]
    quiz_questions = generate_quiz(top_query)
    
    # 3. Match eligible government scheme
    scheme_eligibility = match_scheme(user_degree=degree, age=age, has_phd=has_phd)
    
    return {
        "profile": candidate_profile,
        "quiz": quiz_questions,
        "scheme": scheme_eligibility
    }

if __name__ == "__main__":
    # Test adapter locally
    res = process_returnee_profile(
        resume_text="4 years as Data Analyst using SQL and Excel.",
        target_role="Data Engineer",
        degree="M.Sc",
        age=32,
        has_phd=False
    )
    print("Adapter test successful!")