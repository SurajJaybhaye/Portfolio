// All site content lives here. Sourced from the LinkedIn profile PDF.
// Project links are optional: leave `live` / `repo` out to hide a button.

export const profile = {
  name: "Suraj Jaybhaye",
  title: "Full Stack Developer",
  location: "Pune, Maharashtra, India",
  city: "Pune, India",
  // ⁠ (word joiner) stops "AI-powered" breaking after the hyphen on narrow screens.
  headline: "Full-stack developer\nbuilding AI-⁠powered web apps.",
  intro:
    "I'm a full-stack developer who turns real-world problems into fast, reliable products. I build with AI-assisted development, pairing with Claude to move from idea to deployment faster, across Next.js interfaces, backend systems, AI-powered search and workflow automations.",
  bio: "I build scalable web applications, backend systems, AI-powered products and workflow automations, using AI-assisted development with Claude. Working across Next.js, TypeScript and Firebase on production platforms serving 20+ branches.",
  photo: "/profile.jpg",
  resume: "/Suraj_Jaybhaye_Resume.pdf",
  email: "jaybhayesuraj7@gmail.com",
  availability: "Available for work", // set to "" to hide the hero indicator
  openToWork:
    "I'm interested in reliable products, distributed and backend systems, AI applications, and automation that solves real-world problems. Open to new opportunities. Say hello.",
};

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/surajjaybhaye/" },
  { label: "GitHub", href: "https://github.com/SurajJaybhaye" },
  { label: "LeetCode", href: "https://leetcode.com/u/suraj_jaybhaye/" },
  { label: "X / Twitter", href: "https://x.com/SurajJaybh57552" },
];

export const experience = [
  {
    company: "Invade Code Ltd.",
    icon: "invade",
    role: "Full Stack Developer",
    dates: "Jan 2026 — Present",
    points: [
      "Owned features end-to-end on a multi-tenant Agri ERP (Next.js, TypeScript, Firebase) serving **20+ branches** and **1,000+ daily record updates**.",
      "Built an n8n pipeline that turns Gmail into LinkedIn job posts, cutting posting time from **20–30 min to under 1 min**.",
      "Refactored code into reusable REST components, fixed production issues and mentored interns on Git workflows.",
    ],
  },
  {
    company: "Nebula Technology",
    icon: "building",
    role: "Software Developer",
    dates: "Sep 2024 — Mar 2025",
    points: [
      "Built a Bank Management System with secure login, transactions and a dashboard (React, Node.js, Express, PostgreSQL).",
      "Added JWT authentication and modular APIs, deployed on AWS EC2 with CI/CD via GitHub Actions.",
      "Cut API latency by **~20%** through query optimization.",
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
      "Secured **1st Rank** in Ahilyanagar District in the 12th HSC Board Examination.",
    ],
  },
];

export const skills = {
  Frontend: ["React", "Next.js", "TypeScript", "JavaScript"],
  Backend: ["Node.js", "Java", "Spring Boot", "Python", "REST APIs"],
  "Data & Cloud": ["PostgreSQL", "MySQL", "Firebase", "Redis", "AWS", "Docker"],
  "AI & Automation": [
    "AI-assisted development (Claude)",
    "RAG",
    "LLMs",
    "Qdrant",
    "Elasticsearch",
    "n8n",
  ],
  Tools: ["Git", "GitHub Actions"],
};

export const projects = [
  {
    name: "GovIntel",
    points: [
      "RAG platform that helps Kerala government officers search and draft against hundreds of G.O.s, circulars and rules, in English and Malayalam.",
      "Cut policy lookup from **~15 min to under 30 sec** with cited answers.",
      "Hybrid Qdrant + Elasticsearch retrieval with automated OCR ingestion of uploaded PDFs.",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "Qdrant",
      "Elasticsearch",
      "PostgreSQL",
      "Gemini",
    ],
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
  {
    name: "Job-Posting Automation",
    points: [
      "n8n pipeline that watches Gmail for keywords, generates a job listing and publishes it to LinkedIn.",
      "Cut client posting time from **20–30 min to under 1 min**, with zero manual steps.",
    ],
    tech: ["n8n"],
  },
  {
    name: "Multi-tenant Agri ERP",
    points: [
      "Production ERP built at Invade Code Ltd., serving **20+ branches**.",
      "Handles **1,000+ daily record updates** across retail, inventory and finance workflows.",
    ],
    tech: ["Next.js", "TypeScript", "Firebase"],
  },
] as {
  name: string;
  points: string[];
  tech: string[];
  live?: string;
  repo?: string;
}[];
