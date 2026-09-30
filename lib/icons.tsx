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
  LuWorkflow,
  LuSprout,
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
  "Job-Posting Automation": LuWorkflow,
  "Multi-tenant Agri ERP": LuSprout,
};

// Falls back to a generic icon so unknown names in content.ts never break the page.
export const projectIcon = (name: string): IconType =>
  projectIcons[name] ?? LuCode;
export const hasSkillIcon = (name: string) => name in skillIcons;
export const skillIcon = (name: string): IconType => skillIcons[name] ?? LuCode;
export const socialIcon = (name: string): IconType =>
  socialIcons[name] ?? LuGlobe;
