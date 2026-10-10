// All site content lives here. Mirrors the latest resume; wording is copied from
// it on purpose, so do not round up numbers or add claims that are not on the resume.
// Text wrapped in **double asterisks** is shown in bold (formatting only).
// Project links are optional: leave `live` / `repo` out to hide a button.

export const profile = {
  name: "Suraj Jaybhaye",
  title: "Full Stack Developer | AI Engineer",
  location: "Pune, Maharashtra, India",
  city: "Pune, India",
  headline: "Full Stack Developer | AI Engineer",
  // The resume summary, word for word. Shown in the hero and given to the AI assistant.
  summary:
    "Full stack developer with 1+ year of experience building production web applications and AI-powered products using Next.js, TypeScript, Node.js and Python. Computer Engineering graduate from COEP Technological University with a strong foundation in data structures and algorithms (250+ problems solved) and hands-on experience in RAG pipelines, LLM integrations and AWS. Shipped a multi-tenant ERP serving 20+ branches and RAG search that cut policy lookups from ~30 minutes to under 10 seconds.",
  // A shorter version of the summary for the page's meta / link-preview description.
  bio: "Full stack developer with 1+ year of experience building production web applications and AI-powered products (RAG, LLM integrations) using Next.js, TypeScript, Node.js and Python. Shipped a multi-tenant ERP serving 20+ branches.",
  photo: "/profile.jpg",
  resume: "/Suraj_Jaybhaye_Resume.pdf",
  email: "jaybhayesuraj7@gmail.com",
  availability: "Available for work", // set to "" to hide the hero indicator
  openToWork:
    "I'm interested in reliable products, distributed and backend systems, AI applications, and automation that solves real-world problems. Open to new opportunities. Say hello.",
  // TODO: paste your GeeksforGeeks profile URL. Until then "GeeksforGeeks" shows as plain text.
  gfg: "",
};

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/surajjaybhaye/" },
  { label: "GitHub", href: "https://github.com/SurajJaybhaye" },
  { label: "LeetCode", href: "https://leetcode.com/u/suraj_jaybhaye/" },
  { label: "X / Twitter", href: "https://x.com/SurajJaybh57552" },
];

export type WorkItem = { name: string; tech: string; points: string[] };

export const experience: {
  company: string;
  icon: string;
  role: string;
  location: string;
  dates: string;
  work: WorkItem[];
}[] = [
  {
    company: "Invade Code Ltd.",
    icon: "invade",
    role: "Full Stack Developer",
    location: "Pune",
    dates: "Jan 2026 — Present",
    work: [
      {
        name: "IAG ERP",
        tech: "Next.js, TypeScript, Firebase, Google Genkit",
        points: [
          "Built a role-based agro-retail ERP on Firebase delivering **95+ pages** across POS, inventory, procurement, branch transfers, finance and HR for **20+ branches** and **13 user roles**.",
          "Developed a POS billing module handling **1,000+ bills daily**, with batch- and expiry-aware stock selection, loose-unit pricing, QR-linked digital bills and Firestore transactions.",
          "Implemented GST compliance tooling: HSN summaries, GSTR-2B reconciliation, multi-GSTIN support and portal-ready JSON export.",
          "Integrated AI features with Google Genkit and Gemini 2.5 Flash: invoice extraction, anomaly flagging, cash-flow forecasting and an ERP copilot.",
        ],
      },
      {
        name: "Legal OS",
        tech: "Next.js, TypeScript, Firebase, Firestore Security Rules",
        points: [
          "Built a timesheet correction workflow, leave-management module and .docx monthly reports for a multi-tenant legal practice platform with **9 user roles**.",
          "Fixed a timer concurrency bug (React effect-cleanup race) and corrected **250+** affected time records, using atomic batch writes across 3 collections.",
          "Cut Firestore read costs by scoping live queries per user, and fixed firm-wide permission errors by rewriting security rules.",
        ],
      },
      {
        name: "GovIntel",
        tech: "Python, FastAPI, Gemini, Qdrant, Elasticsearch",
        points: [
          "Co-built (2-member team) an AI policy-search platform, a POC for Kerala State IT Mission, for querying G.O.s and circulars in English and Malayalam with cited answers, cutting lookup from **~30 minutes (officer-reported)** to **under 10 seconds**.",
          "Engineered the hybrid RAG retrieval pipeline: Qdrant vector search + Elasticsearch BM25 merged with Reciprocal Rank Fusion.",
          "Built the ingestion pipeline with Gemini-based OCR, chunking and automatic metadata extraction.",
        ],
      },
      {
        name: "LinkedIn Job-Posting Automation",
        tech: "n8n, Gemini, Gmail API, LinkedIn API",
        points: [
          "AI-powered workflow handling **70–80 job posts weekly**, cutting posting time from **20–30 minutes to under 1 minute** and saving **20+ hours per week**.",
        ],
      },
    ],
  },
  {
    company: "Nebula Technology",
    icon: "building",
    role: "Software Developer Intern",
    location: "Pune",
    dates: "Sep 2024 — Mar 2025",
    work: [
      {
        name: "Banking Web Platform",
        tech: "React, Node.js, Express, PostgreSQL",
        points: [
          "Developed customer-facing pages (account dashboard, transaction history, fund transfers) for a live bank client.",
          "Built and maintained REST APIs in Node.js and Express for account, transaction and transfer operations.",
        ],
      },
    ],
  },
];

export const education = [
  {
    school: "COEP Technological University",
    degree: "B.Tech, Computer Engineering",
    dates: "2020 — 2024",
    points: [
      "Ranked **103rd** (99.92 percentile) in MHT-CET among **540,000+** candidates in Maharashtra State.",
    ],
  },
  {
    school: "Residential Junior College",
    degree: "HSC, Science",
    dates: "2018 — 2020",
    points: [
      "Scored **93.23%** and secured **1st Rank** in Ahilyanagar District in the 12th HSC Board Examination.",
    ],
  },
];

export const skills = {
  Languages: ["TypeScript", "JavaScript", "Python", "Java", "SQL"],
  Frontend: ["React", "Next.js", "Tailwind CSS", "shadcn/ui"],
  Backend: ["Node.js", "Express", "FastAPI", "Spring Boot", "REST APIs"],
  "AI & Automation": [
    "RAG",
    "LLM Integration (Gemini)",
    "Google Genkit",
    "Qdrant",
    "Elasticsearch",
    "Embeddings",
    "OCR",
    "n8n",
  ],
  "Databases & Cloud": [
    "Firebase",
    "Google Cloud",
    "AWS (EC2, S3, Lambda)",
    "PostgreSQL",
    "MySQL",
    "Docker",
  ],
  Tools: ["Git", "GitHub", "JUnit", "Claude Code"],
};

// A short line shown under the skills list.
export const skillsNote = "AI-assisted development with Claude.";

export const projects = [
  {
    name: "GovIntel",
    points: [
      "2-member team POC for Kerala State IT Mission (KSITM): an AI policy-search platform for querying G.O.s and circulars in English and Malayalam with cited answers.",
      "Cut lookup from **~30 minutes (officer-reported)** to **under 10 seconds**.",
      "Hybrid RAG retrieval pipeline: Qdrant vector search + Elasticsearch BM25 merged with Reciprocal Rank Fusion.",
      "Ingestion pipeline with Gemini-based OCR, chunking and automatic metadata extraction.",
    ],
    tech: ["Python", "FastAPI", "Gemini", "Qdrant", "Elasticsearch"],
  },
  {
    name: "UPI Offline Mesh",
    points: [
      "Spring Boot backend with a simulated Bluetooth mesh that settles offline payments once a bridge node regains connectivity.",
      "**RSA-OAEP + AES-256-GCM** encryption with a two-layer replay defense (24-hour freshness window plus per-packet nonce).",
      "**Exactly-once** settlement under concurrent duplicate delivery, verified with JUnit concurrency tests.",
    ],
    tech: ["Java", "Spring Boot", "Hibernate"],
    repo: "https://github.com/SurajJaybhaye/UPI-Without-Internet",
  },
] as {
  name: string;
  points: string[];
  tech: string[];
  live?: string;
  repo?: string;
}[];
