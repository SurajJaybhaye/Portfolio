import type { IconType } from "react-icons";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaJava,
  FaAws,
} from "react-icons/fa6";
import {
  LuCode,
  LuGlobe,
  LuSparkles,
  LuFileSearch,
  LuArrowLeftRight,
  LuLandmark,
  LuWifiOff,
  LuDatabase,
  LuBoxes,
  LuScanText,
} from "react-icons/lu";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiGit,
  SiDocker,
  SiLinux,
  SiVercel,
  SiPython,
  SiFigma,
  SiSpringboot,
  SiFirebase,
  SiRedis,
  SiElasticsearch,
  SiQdrant,
  SiN8N,
  SiGithubactions,
  SiLeetcode,
  SiClaude,
  SiFastapi,
  SiGooglegemini,
  SiHibernate,
  SiShadcnui,
  SiGooglecloud,
  SiGithub,
  SiJunit5,
} from "react-icons/si";

const skillIcons: Record<string, IconType> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  "Tailwind CSS": SiTailwindcss,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  "REST APIs": LuArrowLeftRight,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  Git: SiGit,
  Docker: SiDocker,
  Linux: SiLinux,
  Vercel: SiVercel,
  Python: SiPython,
  Figma: SiFigma,
  Java: FaJava,
  "Spring Boot": SiSpringboot,
  Firebase: SiFirebase,
  Redis: SiRedis,
  AWS: FaAws,
  RAG: LuFileSearch,
  LLMs: LuSparkles,
  "AI-assisted development (Claude)": SiClaude,
  Qdrant: SiQdrant,
  Elasticsearch: SiElasticsearch,
  n8n: SiN8N,
  "GitHub Actions": SiGithubactions,
  FastAPI: SiFastapi,
  Gemini: SiGooglegemini,
  Hibernate: SiHibernate,
  SQL: LuDatabase,
  "shadcn/ui": SiShadcnui,
  "LLM Integration (Gemini)": SiGooglegemini,
  // No brand icon exists for Genkit, so a generic AI sparkle is used.
  "Google Genkit": LuSparkles,
  Embeddings: LuBoxes,
  OCR: LuScanText,
  "Google Cloud": SiGooglecloud,
  "AWS (EC2, S3, Lambda)": FaAws,
  GitHub: SiGithub,
  JUnit: SiJunit5,
  "Claude Code": SiClaude,
};

const socialIcons: Record<string, IconType> = {
  LinkedIn: FaLinkedin,
  GitHub: FaGithub,
  LeetCode: SiLeetcode,
  "X / Twitter": FaXTwitter,
  Instagram: FaInstagram,
};

const projectIcons: Record<string, IconType> = {
  GovIntel: LuLandmark,
  "UPI Offline Mesh": LuWifiOff,
};

// Falls back to a generic icon so unknown names in content.ts never break the page.
export const projectIcon = (name: string): IconType =>
  projectIcons[name] ?? LuCode;
export const hasSkillIcon = (name: string) => name in skillIcons;
export const skillIcon = (name: string): IconType => skillIcons[name] ?? LuCode;
export const socialIcon = (name: string): IconType =>
  socialIcons[name] ?? LuGlobe;
