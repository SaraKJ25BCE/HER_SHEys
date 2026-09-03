# market_mapper.py

HIGH_DEMAND_ROLE_MAP = {
    "Data Engineer": {
        "emerging_title": "MLOps & Cloud Data Architect",
        "market_query": "MLOps Engineer OR Cloud Data Architect"
    },
    "AI/ML Engineer": {
        "emerging_title": "GenAI & Agentic AI Orchestrator",
        "market_query": "GenAI Developer OR AI Agent Engineer"
    },
    "Full Stack Engineer": {
        "emerging_title": "AI Product & Full Stack LLM Engineer",
        "market_query": "Full Stack AI Engineer OR LLM Application Developer"
    }
}

def get_emerging_market_role(target_role: str) -> dict:
    """
    Maps legacy/standard target roles to current, high-demand job titles.
    """
    return HIGH_DEMAND_ROLE_MAP.get(target_role, {
        "emerging_title": "AI Solutions & Platform Engineer",
        "market_query": "AI Solutions Engineer"
    })