// Sample opportunity / scheme / mentor data used while the real backend + GenAI
// pipeline (Person 2 / Person 3) are being built. Response shapes here mirror
// docs/API_CONTRACT.md exactly, so swapping in the live API is a no-op for the UI.

export const SAMPLE_RETURNSHIPS = [
  {
    id: "rt_01",
    title: "Data Analyst Returnship",
    company: "FinEdge Analytics",
    location: "Bengaluru (Hybrid)",
    duration: "16 weeks",
    stack: ["SQL", "Snowflake", "GenAI APIs"],
    matchScore: 88,
    matchReason: "Matched because you completed the Snowflake + GenAI sandbox.",
  },
  {
    id: "rt_02",
    title: "Backend Engineer Returnship",
    company: "Nimbus Health",
    location: "Remote",
    duration: "12 weeks",
    stack: ["Python", "FastAPI", "PostgreSQL"],
    matchScore: 74,
    matchReason: "Matched on Python and prior relational-database experience.",
  },
  {
    id: "rt_03",
    title: "Product Analytics Returnship",
    company: "Loop Commerce",
    location: "Pune (On-site)",
    duration: "14 weeks",
    stack: ["SQL", "Excel", "Looker"],
    matchScore: 81,
    matchReason: "Matched on legacy SQL + Excel skills, low ramp-up needed.",
  },
  {
    id: "rt_04",
    title: "ML Engineering Returnship",
    company: "VerdantAI",
    location: "Hyderabad (Hybrid)",
    duration: "20 weeks",
    stack: ["Python", "scikit-learn", "GenAI APIs"],
    matchScore: 69,
    matchReason: "Partial match — recommend finishing the GenAI sandbox track first.",
  },
  {
    id: "rt_05",
    title: "QA & Test Automation Returnship",
    company: "Bharat Systems",
    location: "Chennai (On-site)",
    duration: "10 weeks",
    stack: ["Selenium", "Python", "CI/CD"],
    matchScore: 63,
    matchReason: "Matched on prior QA background from your résumé.",
  },
  {
    id: "rt_06",
    title: "Cloud Data Engineer Returnship",
    company: "Skyline Analytics",
    location: "Remote",
    duration: "16 weeks",
    stack: ["Snowflake", "SQL", "Airflow"],
    matchScore: 85,
    matchReason: "Matched because you completed the Snowflake + GenAI sandbox.",
  },
  {
    id: "rt_07",
    title: "UX Research Returnship",
    company: "Studio North",
    location: "Bengaluru (Hybrid)",
    duration: "12 weeks",
    stack: ["User Interviews", "Figma", "Analytics"],
    matchScore: 58,
    matchReason: "Adjacent domain match based on stated interests.",
  },
  {
    id: "rt_08",
    title: "GenAI Product Analyst Returnship",
    company: "FinEdge Analytics",
    location: "Bengaluru (Hybrid)",
    duration: "14 weeks",
    stack: ["SQL", "GenAI APIs", "Prompt Design"],
    matchScore: 90,
    matchReason: "Strongest match — sandbox proof-of-work directly aligned.",
  },
];

export const SAMPLE_SCHEMES = [
  {
    id: "sch_01",
    name: "WISE-KIRAN",
    provider: "Dept. of Science & Technology, Govt. of India",
    eligibility: "Women scientists/technologists with a career break, S&T background",
    benefit: "Research re-entry fellowship + mentorship support",
    matchScore: 91,
    link: "https://dst.gov.in",
  },
  {
    id: "sch_02",
    name: "Women Scientist Scheme (WOS-A)",
    provider: "Dept. of Science & Technology, Govt. of India",
    eligibility: "Women in Basic/Applied Sciences, career break of any duration",
    benefit: "Research grant + fellowship for 2–3 years",
    matchScore: 84,
    link: "https://dst.gov.in/scientific-programmes/women-scientists-scheme",
  },
  {
    id: "sch_03",
    name: "Women Scientist Scheme (WOS-B)",
    provider: "Dept. of Science & Technology, Govt. of India",
    eligibility: "Women in S&T interested in societal-impact projects",
    benefit: "Project-based fellowship, S&T interventions for society",
    matchScore: 70,
    link: "https://dst.gov.in/scientific-programmes/women-scientists-scheme",
  },
  {
    id: "sch_04",
    name: "AICTE Pragati Scholarship",
    provider: "AICTE, Ministry of Education",
    eligibility: "Women in technical education seeking to complete/upgrade qualifications",
    benefit: "Scholarship covering tuition + incidentals",
    matchScore: 55,
    link: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
  },
];

export const SAMPLE_MENTORS = [
  {
    id: "m_01",
    name: "Priya Menon",
    role: "Staff Data Engineer",
    company: "Skyline Analytics",
    expertiseTags: ["Snowflake", "SQL", "Career Returns"],
    bio: "Returned to engineering after a 3-year break; now leads Skyline's data platform team.",
    matchScore: 93,
    availability: [
      { slotId: "slot_101", date: "2026-09-08", time: "10:00 AM" },
      { slotId: "slot_102", date: "2026-09-08", time: "4:00 PM" },
      { slotId: "slot_103", date: "2026-09-10", time: "11:30 AM" },
    ],
  },
  {
    id: "m_02",
    name: "Rhea Iyer",
    role: "Applied AI Lead",
    company: "VerdantAI",
    expertiseTags: ["GenAI APIs", "Python", "ML"],
    bio: "Mentors returners transitioning classical ML skills into applied GenAI roles.",
    matchScore: 87,
    availability: [
      { slotId: "slot_201", date: "2026-09-09", time: "9:00 AM" },
      { slotId: "slot_202", date: "2026-09-11", time: "2:00 PM" },
    ],
  },
  {
    id: "m_03",
    name: "Kavitha Subramaniam",
    role: "Engineering Manager",
    company: "Nimbus Health",
    expertiseTags: ["Python", "FastAPI", "People Management"],
    bio: "Hires returnship candidates directly onto her backend team every quarter.",
    matchScore: 76,
    availability: [
      { slotId: "slot_301", date: "2026-09-08", time: "1:00 PM" },
      { slotId: "slot_302", date: "2026-09-12", time: "10:00 AM" },
    ],
  },
  {
    id: "m_04",
    name: "Neha Chatterjee",
    role: "Product Analytics Director",
    company: "Loop Commerce",
    expertiseTags: ["SQL", "Excel", "Analytics"],
    bio: "Specializes in helping analysts refresh legacy SQL/Excel skills for modern BI stacks.",
    matchScore: 80,
    availability: [{ slotId: "slot_401", date: "2026-09-09", time: "5:00 PM" }],
  },
  {
    id: "m_05",
    name: "Divya Krishnan",
    role: "Senior QA Architect",
    company: "Bharat Systems",
    expertiseTags: ["Selenium", "CI/CD", "Test Automation"],
    bio: "Took a 5-year caregiving break; now architects QA pipelines for a 200-engineer org.",
    matchScore: 68,
    availability: [{ slotId: "slot_501", date: "2026-09-10", time: "3:00 PM" }],
  },
  {
    id: "m_06",
    name: "Ananya Bose",
    role: "Founder, Studio North",
    company: "Studio North",
    expertiseTags: ["UX Research", "Figma", "Career Pivots"],
    bio: "Mentors women pivoting into UX from adjacent technical backgrounds.",
    matchScore: 61,
    availability: [{ slotId: "slot_601", date: "2026-09-11", time: "11:00 AM" }],
  },
];

// ---- Skill profile + sandbox mock generator -------------------------------
// This mimics what Person 3's GenAI pipeline will eventually return. Kept
// deterministic (no randomness) so demos are repeatable.

export function mockAnalyzeSkills({ candidateName = "Ananya Rao", yearsOfBreak = 4 } = {}) {
  const legacySkills = [
    { skill: "SQL", level: 70 },
    { skill: "Excel / VBA", level: 80 },
    { skill: "Python (basic)", level: 40 },
    { skill: "Data Visualization", level: 55 },
  ];
  const marketSkills = [
    { skill: "SQL", level: 70, targetLevel: 85 },
    { skill: "Snowflake", level: 5, targetLevel: 75 },
    { skill: "GenAI APIs", level: 0, targetLevel: 70 },
    { skill: "Python", level: 40, targetLevel: 75 },
    { skill: "Cloud BI Tools", level: 20, targetLevel: 65 },
  ];
  return {
    profileId: `prof_${Math.random().toString(36).slice(2, 8)}`,
    candidateName,
    yearsOfBreak,
    legacySkills,
    marketSkills,
    gapSummary:
      "Strong SQL and spreadsheet foundation. The core gap is cloud data-warehousing " +
      "(Snowflake) and applied GenAI tooling — both closable in a focused sandbox week.",
  };
}

export function mockGenerateSandbox() {
  return {
    sandboxId: `sbx_${Math.random().toString(36).slice(2, 8)}`,
    title: "SQL + Excel → Snowflake + GenAI APIs",
    targetReturnship: "GenAI Product Analyst Returnship — FinEdge Analytics",
    days: [
      {
        day: 1,
        title: "Reconnect: SQL, reframed",
        markdown:
          "### Where you're starting from\nYou already know `JOIN`, `GROUP BY`, and pivot " +
          "tables cold — that's the hard part. Today just maps what you know onto a cloud " +
          "warehouse.\n\n### Why this matters\nSnowflake queries feel like SQL because they " +
          "mostly are. The differences are in *how compute scales*, not in how you write a query.\n\n" +
          "**Outcome:** a working Snowflake trial account with your first query executed against a sample dataset.",
        tasks: [
          { id: "d1t1", label: "Create a free Snowflake trial account", done: false },
          { id: "d1t2", label: "Load the sample TPCH dataset", done: false },
          { id: "d1t3", label: "Run a GROUP BY query you'd recognize from Excel pivots", done: false },
        ],
      },
      {
        day: 2,
        title: "Scale it up: warehouses & performance",
        markdown:
          "### New concept, familiar instinct\nA Snowflake *virtual warehouse* is just compute " +
          "you can resize. If you've ever waited on a slow VLOOKUP, you already understand *why* " +
          "this matters.\n\n**Outcome:** one query re-run against two warehouse sizes, with the " +
          "time difference noted.",
        tasks: [
          { id: "d2t1", label: "Resize your virtual warehouse (X-Small → Small)", done: false },
          { id: "d2t2", label: "Re-run yesterday's query and compare timing", done: false },
          { id: "d2t3", label: "Write 2 lines on when you'd scale up vs. down", done: false },
        ],
      },
      {
        day: 3,
        title: "Bridge to 2026: calling a GenAI API",
        markdown:
          "### The actual bridge\nToday you pull rows the way you always have, then hand a " +
          "sample to a GenAI API to *summarize or classify* them — the part of the job that " +
          "didn't exist when you left.\n\n**Outcome:** a short script that queries Snowflake, then " +
          "sends the result to a free-tier GenAI API for a plain-English summary.",
        tasks: [
          { id: "d3t1", label: "Get a free-tier API key (Claude or Gemini)", done: false },
          { id: "d3t2", label: "Query 20 rows from Snowflake into a script", done: false },
          { id: "d3t3", label: "Ask the API to summarize the trend in one paragraph", done: false },
        ],
      },
      {
        day: 4,
        title: "Ship a small deliverable",
        markdown:
          "### Make it show-able\nPackage yesterday's script and query into a one-page notebook " +
          "or short dashboard — something you could screenshot in an interview.\n\n**Outcome:** a " +
          "shareable notebook/script link plus one chart.",
        tasks: [
          { id: "d4t1", label: "Package the query + summary into a notebook", done: false },
          { id: "d4t2", label: "Add one chart (matplotlib, Excel, or Looker)", done: false },
          { id: "d4t3", label: "Push it somewhere shareable (GitHub Gist / Drive link)", done: false },
        ],
      },
      {
        day: 5,
        title: "Proof of work",
        markdown:
          "### Turn the week into a paragraph\nThis is the artifact that goes into your " +
          "returnship application and into the message you send a mentor — not a list of " +
          "completed tasks, but *what you can now do*.\n\n**Outcome:** a generated proof-of-work " +
          "summary and skill tags, ready to paste into an application.",
        tasks: [
          { id: "d5t1", label: "Review all 4 days of work", done: false },
          { id: "d5t2", label: "Generate your proof-of-work summary", done: false },
        ],
      },
    ],
    proofOfWorkSummary: null,
  };
}

export function mockProofOfWork() {
  return {
    proofOfWorkSummary:
      "Rebuilt a legacy SQL + Excel analytics workflow on Snowflake, and extended it with a " +
      "GenAI API call to auto-summarize query results in plain English — shipped as a shareable " +
      "notebook in under a week.",
    skillTags: ["SQL", "Snowflake", "GenAI APIs", "Data Summarization"],
  };
}
