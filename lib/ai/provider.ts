import type { ChatProvider } from "./types";
import { anthropicProvider } from "./providers/anthropic";
import { openAICompatibleProvider } from "./providers/openai-compatible";
import { localProvider } from "./providers/local";

let warned = false;
const warn = (msg: string) => {
  if (warned) return;
  warned = true;
  console.warn(`[ai] ${msg} Falling back to demo mode.`);
};

// Picks the provider from environment variables (see .env.example).
// With nothing configured, the built-in demo is used.
export function getProvider(): ChatProvider {
  const env = process.env;
  const kind = (env.AI_PROVIDER ?? "").toLowerCase();
  // Ceiling on reply length, not a target: answers are 2-5 sentences. Models that
  // "think" share this budget with their hidden reasoning, and a small cap cut
  // replies off mid-sentence in testing, so leave generous headroom.
  const maxTokens = Number(env.AI_MAX_TOKENS) || 1200;

  if (kind === "anthropic" || (!kind && env.ANTHROPIC_API_KEY)) {
    const key = env.ANTHROPIC_API_KEY ?? env.AI_API_KEY;
    if (key) {
      return anthropicProvider(
        key,
        env.AI_MODEL || "claude-opus-5-5",
        maxTokens,
      );
    }
    warn("AI_PROVIDER=anthropic but no ANTHROPIC_API_KEY is set.");
  } else if (kind === "openai") {
    const { AI_API_KEY: apiKey, AI_BASE_URL: baseUrl, AI_MODEL: model } = env;
    if (apiKey && baseUrl && model) {
      return openAICompatibleProvider({
        apiKey,
        baseUrl,
        model,
        reasoningEffort: env.AI_REASONING_EFFORT || undefined,
        fallbackModel: env.AI_FALLBACK_MODEL || undefined,
        maxTokens,
      });
    }
    warn("AI_PROVIDER=openai needs AI_API_KEY, AI_BASE_URL and AI_MODEL.");
  } else if (kind) {
    warn(`Unknown AI_PROVIDER "${kind}" (use "anthropic" or "openai").`);
  }
  return localProvider;
}
