import { profile } from "@/lib/content";

// Fixed limits shared by the chat panel and the server route. No secrets here,
// so it is safe to import in the browser. Server-only knobs (daily caps, token
// limit) are read from environment variables, see .env.example.
export const LIMITS = {
  // Longest question a visitor can send, in characters.
  userChars: 300,
  // Longest earlier assistant reply accepted back in the history.
  assistantChars: 2000,
  // Questions allowed in one conversation before asking visitors to email.
  maxTurns: 8,
};

// The model is told to answer with exactly this word for anything unrelated to
// the portfolio. The server swaps it for OFF_TOPIC_REPLY.
export const OFF_TOPIC_MARKER = "OFF_TOPIC";

// Appended when a live reply is cut off part-way (for example the provider is overloaded).
export const INTERRUPTED_NOTE =
  " … (The AI reply was interrupted. Please try again, or email instead.)";

export const OFF_TOPIC_REPLY = `I can only answer questions about ${profile.name}'s background, projects, skills and how to get in touch. Try asking about a project or the tech stack.`;
