import type { ChatProvider } from "../types";

// Works with any API that speaks the OpenAI "chat completions" format with
// streaming: Groq, Google Gemini (OpenAI-compatible endpoint), OpenRouter,
// Mistral and others. Set AI_BASE_URL, AI_API_KEY and AI_MODEL.

// Temporary server-side errors worth one more try on the same model.
const RETRYABLE = new Set([500, 502, 503, 504]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function openAICompatibleProvider(opts: {
  apiKey: string;
  baseUrl: string;
  model: string;
  // Optional backup model, tried when the main one is overloaded (5xx) or out of
  // quota (429). Free tiers often overload their newest model, and quotas are
  // usually per model, so a second model often still has room.
  fallbackModel?: string;
  // Optional. Models that "think" (e.g. Gemini) share the reply budget with their
  // hidden reasoning. "none" (or "low") keeps answers complete and fast. Only sent
  // if set, because providers that do not know the field may reject it, and
  // support differs per model (some reject "minimal" or "none").
  reasoningEffort?: string;
  maxTokens: number;
}): ChatProvider {
  const url = `${opts.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const chain = [
    opts.model,
    ...(opts.fallbackModel && opts.fallbackModel !== opts.model
      ? [opts.fallbackModel]
      : []),
  ];

  // reasoning_effort is only sent to the main model: support differs per model, and
  // the backup (e.g. flash-lite) can reject values the main model accepts.
  const request = (
    model: string,
    messages: object[],
    withEffort: boolean,
    signal?: AbortSignal,
  ) =>
    fetch(url, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${opts.apiKey}`,
      },
      body: JSON.stringify({
        model,
        stream: true,
        max_tokens: opts.maxTokens,
        temperature: 0.3,
        ...(withEffort && opts.reasoningEffort
          ? { reasoning_effort: opts.reasoningEffort }
          : {}),
        messages,
      }),
    });

  return {
    name: `openai-compatible:${opts.model}`,
    live: true,
    async *stream(messages, system, signal) {
      const payload = [{ role: "system", content: system }, ...messages];
      let res: Response | null = null;
      let failure = "";

      // For each model: one retry on a temporary 5xx. Then move to the backup
      // model on 5xx or 429. Anything else (bad key, bad request) stops at once.
      outer: for (const model of chain) {
        for (let retry = 0; retry < 2; retry++) {
          const attempt = await request(
            model,
            payload,
            model === opts.model,
            signal,
          );
          if (attempt.ok && attempt.body) {
            res = attempt;
            break outer;
          }
          const detail = (await attempt.text().catch(() => ""))
            .replace(/\s+/g, " ")
            .slice(0, 200);
          failure = `Provider responded with ${attempt.status} (${model})${detail ? `: ${detail}` : ""}`;
          if (RETRYABLE.has(attempt.status) && retry === 0) {
            await sleep(600);
            continue;
          }
          if (!RETRYABLE.has(attempt.status) && attempt.status !== 429) {
            break outer;
          }
          break; // try the backup model, if there is one
        }
      }
      if (!res?.body) throw new Error(failure || "Provider request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finish: string | null = null;
      let sawDone = false;

      // Handles one SSE line. Returns text to emit, or throws on a provider error.
      const handle = (raw: string): string => {
        const line = raw.trim();
        if (!line.startsWith("data:")) return "";
        const data = line.slice(5).trim();
        if (data === "[DONE]") {
          sawDone = true;
          return "";
        }
        let json: unknown;
        try {
          json = JSON.parse(data);
        } catch {
          return ""; // ignore keep-alive or malformed lines
        }
        const event = (Array.isArray(json) ? json[0] : json) as {
          error?: { message?: string };
          choices?: { delta?: { content?: string }; finish_reason?: string }[];
        };
        if (event?.error) {
          throw new Error(event.error.message || "Provider sent an error");
        }
        const choice = event?.choices?.[0];
        if (choice?.finish_reason) finish = choice.finish_reason;
        return choice?.delta?.content ?? "";
      };

      while (!sawDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const raw of lines) {
          const text = handle(raw);
          if (text) yield text;
        }
      }
      if (buffer && !sawDone) {
        const text = handle(buffer); // last line may have no trailing newline
        if (text) yield text;
      }
      // A stream that ends without a finish reason or [DONE] was cut off.
      if (!sawDone && !finish) throw new Error("Stream ended unexpectedly");
      // Hit the reply-length cap: mark the cut instead of ending mid-sentence.
      if (finish === "length") yield " …";
    },
  };
}
