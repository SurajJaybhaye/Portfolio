import Anthropic from "@anthropic-ai/sdk";
import type { ChatProvider } from "../types";

// Models that accept `output_config.effort` and the server-side refusal fallback.
// Other models (for example Haiku 4.5) get a plain request.
const MODERN = new Set([
  "claude-opus-5-5",
  "claude-opus-5",
  "claude-sonnet-5-5",
  "claude-fable-5-1",
]);

export function anthropicProvider(
  apiKey: string,
  model: string,
  maxTokens: number,
): ChatProvider {
  const client = new Anthropic({ apiKey });
  const modern = MODERN.has(model);

  return {
    name: `anthropic:${model}`,
    live: true,
    async *stream(messages, system, signal) {
      const stream = client.beta.messages.stream(
        {
          model,
          max_tokens: maxTokens,
          system,
          messages,
          // Low effort keeps replies quick and cheap for simple Q&A.
          ...(modern
            ? {
                output_config: { effort: "low" as const },
                betas: ["server-side-fallback-2026-07-01"],
                fallbacks: "default" as const,
              }
            : {}),
        },
        { signal },
      );

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          yield event.delta.text;
        }
      }
    },
  };
}
