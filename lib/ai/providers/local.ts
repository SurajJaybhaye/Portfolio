import {
  profile,
  socials,
  experience,
  education,
  skills,
  skillsNote,
  projects,
} from "@/lib/content";
import type { ChatProvider } from "../types";

// Demo provider: answers common questions from lib/content.ts with simple
// keyword matching. No API key, no network, no cost. Used until a real provider
// is configured in the environment.

const has = (q: string, re: RegExp) => re.test(q);

function answer(question: string): string {
  const q = question.toLowerCase();
  const name = profile.name;

  // A specific project or work item beats the generic questions.
  const topics: { name: string; re: RegExp; text: string }[] = [
    ...projects.map((p) => ({
      name: p.name,
      re: {
        GovIntel: /\b(govintel|government|policy|kerala|ksitm)\b/,
        "UPI Offline Mesh": /\b(upi|mesh|offline|payments?|bluetooth)\b/,
      }[p.name] as RegExp,
      text: `**${p.name}**: ${p.points.join(" ")}\nBuilt with ${p.tech.join(", ")}.`,
    })),
    ...experience.flatMap((e) =>
      e.work.map((w) => ({
        name: w.name,
        re: (
          {
            "IAG ERP":
              /\b(iag|erp|agro|retail|pos|billing|gst|genkit|branch(es)?)\b/,
            "Legal OS": /\b(legal|timesheets?|leave|firm)\b/,
            "LinkedIn Job-Posting Automation":
              /\b(n8n|job.?posting|linkedin|gmail)\b/,
            "Banking Web Platform": /\b(bank|banking|nebula)\b/,
          } as Record<string, RegExp>
        )[w.name],
        text: `**${w.name}** (${w.tech}), at ${e.company}: ${w.points.join(" ")}`,
      })),
    ),
  ];
  for (const t of topics) {
    if (t.re?.test(q)) return t.text;
  }

  if (has(q, /^(hi|hello|hey|namaste|good (morning|evening))\b/)) {
    return `Hi! I can tell you about ${name}'s experience, projects, skills and education. What would you like to know?`;
  }
  if (
    has(
      q,
      /\b(available|availability|hire|hiring|open to|opportunit\w*|freelance|work with|job offer)\b/,
    )
  ) {
    return `${name} is ${profile.availability ? "**" + profile.availability.toLowerCase() + "**" : "open to new opportunities"}. The best way to reach out is by email at ${profile.email || "the contact links below"}.`;
  }
  if (has(q, /\b(resume|cv)\b/)) {
    return `You can open ${name}'s resume with the **View Resume** button at the top of the page.`;
  }
  if (
    has(q, /\b(contact|email|reach|linkedin|github|twitter|social|connect)\b/)
  ) {
    const links = socials.map((s) => `${s.label}: ${s.href}`).join("\n");
    return `Email: ${profile.email}\n${links}`;
  }
  if (has(q, /\b(leetcode|dsa|algorithms?|competitive|coding activity)\b/)) {
    const lc = socials.find((s) => s.label === "LeetCode");
    return `${name} has solved **250+ DSA problems** across LeetCode and GeeksforGeeks. The **Coding activity** section shows the past year of LeetCode submissions${lc ? `, and the profile is at ${lc.href}` : ""}.`;
  }
  if (
    has(
      q,
      /\b(education|college|university|degree|study|studied|school|coep|rank)\b/,
    )
  ) {
    return education
      .map(
        (e) =>
          `**${e.school}**: ${e.degree} (${e.dates}). ${e.points[0] ?? ""}`,
      )
      .join("\n");
  }
  if (
    has(
      q,
      /\b(experience|work|worked|job|role|company|career|employer|invade|nebula)\b/,
    )
  ) {
    return experience
      .map(
        (e) =>
          `**${e.role}** at ${e.company}, ${e.location} (${e.dates}): ${e.work.map((w) => w.name).join(", ")}.`,
      )
      .join("\n");
  }
  if (has(q, /\b(projects?|built|build|made|portfolio|created)\b/)) {
    const names = [
      ...new Set([
        ...projects.map((p) => p.name),
        ...experience.flatMap((e) => e.work.map((w) => w.name)),
      ]),
    ];
    return `${name} has worked on ${names.join(", ")}. Ask about any of them for details. For example: ${projects[0].name}.`;
  }
  if (
    has(
      q,
      /\b(skills?|stack|tech|technologies|languages?|frameworks?|tools?|know|good at)\b/,
    )
  ) {
    return (
      Object.entries(skills)
        .map(([g, items]) => `**${g}**: ${items.join(", ")}`)
        .join("\n") + `\n${skillsNote}`
    );
  }
  if (has(q, /\b(claude|ai[- ]assisted|llms?|rag|genai|artificial)\b/)) {
    return `${name} uses **AI-assisted development with Claude** (Claude Code is in the toolset), and has built AI-powered products: GovIntel, a RAG platform, and AI features in the IAG ERP with Google Genkit and Gemini 2.5 Flash.`;
  }
  if (has(q, /\b(where|location|based|live|pune|city)\b/)) {
    return `${name} is based in ${profile.location}.`;
  }
  if (has(q, /\b(who|about|bio|yourself|introduce|tell me)\b/)) {
    return `${name} is based in ${profile.location}. ${profile.summary}`;
  }
  return `I can answer questions about ${name}'s experience, projects, skills, education and how to get in touch. Try asking: "What has ${name.split(" ")[0]} built?"`;
}

export const localProvider: ChatProvider = {
  name: "demo",
  live: false,
  async *stream(messages, _system, signal) {
    const last = [...messages].reverse().find((m) => m.role === "user");
    const words = answer(last?.content ?? "").split(/(\s+)/);
    // Stream a few words at a time so the demo behaves like a real model.
    for (let i = 0; i < words.length; i += 3) {
      if (signal?.aborted) return;
      yield words.slice(i, i + 3).join("");
      await new Promise((r) => setTimeout(r, 25));
    }
  },
};
