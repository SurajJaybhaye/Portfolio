import { getProvider } from "@/lib/ai/provider";
import { localProvider } from "@/lib/ai/providers/local";
import { SYSTEM_PROMPT } from "@/lib/ai/knowledge";
import { SUGGESTIONS } from "@/lib/ai/suggestions";
import { rateLimit, withinDailyBudget } from "@/lib/ai/rate-limit";
import {
  INTERRUPTED_NOTE,
  LIMITS,
  OFF_TOPIC_MARKER,
  OFF_TOPIC_REPLY,
} from "@/lib/ai/config";
import type { ChatMessage } from "@/lib/ai/types";

const DAY = 24 * 60 * 60_000;
const num = (v: string | undefined, fallback: number) => Number(v) || fallback;

const json = (error: string, status: number, extra?: HeadersInit) =>
  Response.json({ error }, { status, headers: extra });

type Parsed = ChatMessage[] | "invalid" | "limit";

function parseMessages(body: unknown): Parsed {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return "invalid";
  if (raw.length > LIMITS.maxTurns * 2) return "limit";

  const messages: ChatMessage[] = [];
  for (const m of raw) {
    const role = (m as { role?: unknown })?.role;
    const content = (m as { content?: unknown })?.content;
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string"
    ) {
      return "invalid";
    }
    const cap = role === "user" ? LIMITS.userChars : LIMITS.assistantChars;
    const text = content.trim().slice(0, cap);
    if (!text) return "invalid";
    messages.push({ role, content: text });
  }
  // The conversation must start with, and end on, a visitor message.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return "invalid";
  }
  const turns = messages.filter((m) => m.role === "user").length;
  return turns > LIMITS.maxTurns ? "limit" : messages;
}

// Reads chunks until `min` characters are buffered (or the stream ends), so the
// start of a reply can be inspected before anything is sent to the visitor.
async function readHead(it: AsyncGenerator<string>, min: number) {
  let head = "";
  while (head.length < min) {
    const next = await it.next();
    if (next.done) return { head, done: true };
    head += next.value;
  }
  return { head, done: false };
}

function textResponse(
  head: string,
  rest: AsyncGenerator<string> | null,
  mode: "live" | "demo" | "faq" | "fallback",
) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (head) controller.enqueue(encoder.encode(head));
        if (rest) {
          for await (const chunk of rest) {
            controller.enqueue(encoder.encode(chunk));
          }
        }
        controller.close();
      } catch (error) {
        // The visitor may already have part of the reply: say it was cut off.
        console.error(
          "[ai] reply interrupted:",
          error instanceof Error ? error.message : error,
        );
        try {
          controller.enqueue(encoder.encode(INTERRUPTED_NOTE));
          controller.close();
        } catch {
          // the visitor closed the connection; nothing left to send
        }
      }
    },
    cancel() {
      void rest?.return(undefined);
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-AI-Mode": mode,
    },
  });
}

const isStarter = (text: string) =>
  SUGGESTIONS.some((s) => s.toLowerCase() === text.trim().toLowerCase());

export async function POST(request: Request) {
  // Reject requests that come from another website.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return json("Forbidden", 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json("Invalid request", 400);
  }
  const messages = parseMessages(body);
  if (messages === "invalid") return json("Invalid request", 400);
  if (messages === "limit") {
    return json(
      "This conversation has reached its limit. Please email instead.",
      429,
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const burst = rateLimit(ip, num(process.env.AI_BURST_LIMIT, 8), 10 * 60_000);
  if (!burst.ok) {
    return json("Too many messages. Please try again in a few minutes.", 429, {
      "Retry-After": String(burst.retryAfter),
    });
  }
  const daily = rateLimit(
    `${ip}:day`,
    num(process.env.AI_VISITOR_DAILY_LIMIT, 20),
    DAY,
  );
  if (!daily.ok) {
    return json("You've reached today's limit. Please email instead.", 429, {
      "Retry-After": String(daily.retryAfter),
    });
  }

  const local = () =>
    localProvider.stream(messages, SYSTEM_PROMPT, request.signal);
  const provider = getProvider();

  // No AI configured: the built-in FAQ answers everything (demo mode).
  if (!provider.live) return textResponse("", local(), "demo");
  // Starter questions are answered from the FAQ and never use API quota.
  if (isStarter(messages[messages.length - 1].content)) {
    return textResponse("", local(), "faq");
  }
  // Daily quota used up: fall back to the FAQ instead of showing an error.
  if (!withinDailyBudget(num(process.env.AI_DAILY_LIMIT, 300))) {
    return textResponse("", local(), "fallback");
  }

  try {
    const it = provider.stream(messages, SYSTEM_PROMPT, request.signal);
    const { head, done } = await readHead(it, OFF_TOPIC_MARKER.length);
    if (head.trim().startsWith(OFF_TOPIC_MARKER)) {
      void it.return(undefined);
      return textResponse(OFF_TOPIC_REPLY, null, "live");
    }
    if (!head.trim()) throw new Error("empty response");
    return textResponse(head, done ? null : it, "live");
  } catch (error) {
    // Bad key, quota exceeded, provider outage: answer from the FAQ instead.
    console.error(
      `[ai] ${provider.name} failed, using FAQ fallback:`,
      error instanceof Error ? error.message : error,
    );
    return textResponse("", local(), "fallback");
  }
}
