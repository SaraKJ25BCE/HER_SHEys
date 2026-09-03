import streamlit as st
import requests
from pypdf import PdfReader

API_URL = "[http://127.0.0.1:8000/api/analyze](http://127.0.0.1:8000/api/analyze)"

st.set_page_config(page_title="Re-STEM Platform", layout="wide")
st.title("🌱 Re-STEM: AI Career Re-Entry Engine")
st.caption("Empowering women in STEM to reboot their careers with confidence.")

# --- SIDEBAR: CANDIDATE INPUTS & PDF UPLOADER ---
st.sidebar.header("Candidate Profile")
target_role = st.sidebar.selectbox("Target Re-entry Role", ["Data Engineer", "AI/ML Engineer", "Full Stack Engineer"])
degree = st.sidebar.selectbox("Highest Degree", ["M.Sc", "B.Tech", "Ph.D.", "B.Sc"])
age = st.sidebar.number_input("Age", min_value=20, max_value=65, value=32)
has_phd = st.sidebar.checkbox("Holds Ph.D.?", value=(degree == "Ph.D."))

st.sidebar.subheader("Resume Input")
uploaded_file = st.sidebar.file_uploader("Upload Resume (PDF or TXT)", type=["pdf", "txt"])

# Resume Extraction Logic
resume_text = ""
if uploaded_file is not None:
    if uploaded_file.name.endswith(".pdf"):
        try:
            pdf_reader = PdfReader(uploaded_file)
            for page in pdf_reader.pages:
                extracted = page.extract_text()
                if extracted:
                    resume_text += extracted + "\n"
        except Exception as e:
            st.sidebar.error(f"Error reading PDF: {e}")
    else:
        resume_text = uploaded_file.read().decode("utf-8")

# Fallback text area if no file is uploaded or extraction is empty
if not resume_text.strip():
    resume_text = st.text_area(
        "Or paste resume text manually:",
        height=150,
        value="4 years experience as SQL Analyst working with databases and basic Excel automation. Took a 3-year caregiving break."
    )
else:
    st.sidebar.success("✅ Resume loaded successfully!")
    with st.expander("📄 View Extracted Resume Text"):
        st.write(resume_text)

# --- ACTION BUTTON & CACHED PIPELINE EXECUTION ---
if st.button("🚀 Analyze Profile & Generate Roadmap"):
    if not resume_text.strip():
        st.error("Please upload a valid resume PDF or enter resume text before proceeding.")
    else:
        with st.spinner("Processing through GenAI engine in a single pass..."):
            payload = {
                "resume_text": resume_text,
                "target_role": target_role,
                "degree": degree,
                "age": age,
                "has_phd": has_phd
            }
            try:
                response = requests.post(API_URL, json=payload)
                if response.status_code == 200:
                    # Save payload to session state to make UI interactions instantaneous
                    st.session_state["pipeline_data"] = response.json()
                else:
                    st.error("Error communicating with backend server.")
            except Exception as e:
                st.error(f"Could not connect to FastAPI server at {API_URL}. Ensure `main.py` is running! Details: {e}")

# --- RENDER RESULTS FROM SESSION STATE ---
if "pipeline_data" in st.session_state:
    data = st.session_state["pipeline_data"]
    ai = data["ai_pipeline"]
    
    # SECTION 1: SKILLS & GAPS
    st.subheader("📊 Skill Analysis & Market Delta")
    col1, col2 = st.columns(2)
    profile = ai.get("candidate_profile", {})
    with col1:
        st.markdown("**Existing Skills:**")
        st.write(", ".join(profile.get("existing_skills", [])))
    with col2:
        st.markdown("**Skill Gaps to Work On:**")
        for gap in profile.get("missing_skills_for_target", []):
            st.error(f"• {gap}")
    
    st.divider()

    # SECTION 2: GOVERNMENT SCHEMES
    st.subheader("🏛️ Matched DST Government Scheme")
    scheme = ai.get("matched_scheme", {})
    st.success(f"**Scheme:** {scheme.get('matched_scheme', 'None')}")
    st.write(f"**Reason:** {scheme.get('reason', 'N/A')}")

    st.divider()

    # SECTION 3: 5-DAY MICRO-RETURNSHIP SANDBOX
    st.subheader("🛠️ Your 5-Day Micro-Returnship Project")
    for day in ai.get("micro_returnship_sandbox", []):
        with st.expander(f"Day {day['day']}: {day['title']}"):
            st.write(f"**Objective:** {day['objective']}")
            st.write(f"**Task:** {day['task_description']}")
            st.code(f"Deliverable: {day['github_deliverable']}", language="markdown")

    st.divider()

    # SECTION 4: MATCHED RETURNSHIPS & MENTORS
    c1, c2 = st.columns(2)
    with c1:
        st.subheader("💼 Matched Returnships")
        for job in data.get("matched_returnships", []):
            st.write(f"**{job['title']}** — {job['company']}")
            st.caption(f"Location: {job['location']} | Duration: {job['duration']}")
            st.button(f"Apply for {job['title']}", key=f"job_{job['id']}")
    
    with c2:
        st.subheader("🤝 Peer Mentors")
        for mentor in data.get("matched_mentors", []):
            st.write(f"**{mentor['name']}** ({mentor['role']})")
            st.caption(f"Journey: {mentor['break_history']}")
            st.button(f"Book Session ({mentor['availability']})", key=f"mentor_{mentor['id']}")