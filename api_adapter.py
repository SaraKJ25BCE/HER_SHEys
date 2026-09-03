# api_adapter.py
from hackkk import process_full_returnee_pipeline

def process_returnee_profile(resume_text: str, target_role: str, degree: str, age: int, has_phd: bool) -> dict:
    """
    Unified entry point for FastAPI/Streamlit backend to invoke the single-pass AI pipeline.
    """
    return process_full_returnee_pipeline(resume_text, target_role, degree, age, has_phd)