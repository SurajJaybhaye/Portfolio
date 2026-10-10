"use client";

import { useEffect, useRef, useState } from "react";
import { LuSparkles, LuX, LuArrowUp } from "react-icons/lu";
import RichText from "@/components/RichText";
import { SUGGESTIONS } from "@/lib/ai/suggestions";
import { LIMITS } from "@/lib/ai/config";
import { profile } from "@/lib/content";

type Msg = { role: "user" | "assistant"; content: string };
// live: real AI answer | demo: no AI configured | fallback: AI unavailable or
// over quota | faq: starter question answered locally.
type Mode = "live" | "demo" | "fallback" | "faq";

const FIRST_NAME = profile.name.split(" ")[0];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("live");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const wasOpen = useRef(false);

  // Move focus into the panel when it opens, and back to the button when it closes.
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else if (wasOpen.current) toggleRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const close = () => setOpen(false);

  const turns = messages.filter((m) => m.role === "user").length;
  const atLimit = turns >= LIMITS.maxTurns;

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setLoading(false);
    setMode("live");
  };

  // The input is unmounted at the limit; focus it again once it returns.
  const wasAtLimit = useRef(false);
  useEffect(() => {
    if (!atLimit && wasAtLimit.current) inputRef.current?.focus();
    wasAtLimit.current = atLimit;
  }, [atLimit]);

  const setLast = (content: string) =>
    setMessages((m) => [...m.slice(0, -1), { role: "assistant", content }]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading || atLimit) return;
    const history: Msg[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setLast(
          res.status === 429
            ? (data?.error ??
                "Too many messages. Please try again in a few minutes.")
            : `Sorry, I can't answer right now. You can email ${profile.email || FIRST_NAME} instead.`,
        );
        return;
      }
      setMode((res.headers.get("X-AI-Mode") as Mode | null) ?? "live");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setLast(reply);
      }
      if (!reply.trim())
        setLast("I couldn't come up with an answer. Please try rephrasing.");
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setLast(
          `Something went wrong. You can email ${profile.email || FIRST_NAME} instead.`,
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const note =
    mode === "demo"
      ? "Demo mode: answers come from a built-in FAQ."
      : mode === "fallback"
        ? "The AI is busy right now, so this answer comes from a built-in FAQ."
        : "AI can make mistakes. Questions are processed by an AI provider, so please don't share personal details.";

  if (!open) {
    return (
      <button
        ref={toggleRef}
        onClick={() => setOpen(true)}
        aria-label={`Ask AI about ${FIRST_NAME}`}
        className="neumorphic fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-on-surface/[0.06] bg-surface px-4 py-3 text-[0.85rem] font-bold tracking-wide text-on-surface/80 transition-transform duration-300 hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
      >
        <LuSparkles aria-hidden className="text-base text-primary" />
        Ask AI
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={`Ask about ${FIRST_NAME}`}
      className="ai-panel fixed inset-x-3 bottom-3 z-50 flex h-[min(34rem,calc(100svh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-on-surface/[0.1] bg-surface shadow-[0_20px_60px_-15px_var(--shadow-dark)] dark:border-on-surface/[0.16] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[24rem]"
    >
      <header className="flex items-center justify-between border-b border-on-surface/[0.06] px-4 py-3 dark:border-on-surface/[0.12]">
        <div className="flex items-center gap-2">
          <LuSparkles aria-hidden className="text-primary" />
          <h2 className="text-sm font-semibold text-on-surface">
            Ask about {FIRST_NAME}
          </h2>
        </div>
        <button
          onClick={close}
          aria-label="Close assistant"
          className="rounded-lg p-1.5 text-mid transition-colors hover:bg-container-high hover:text-on-surface"
        >
          <LuX aria-hidden />
        </button>
      </header>

      <div
        ref={listRef}
        role="log"
        tabIndex={0}
        aria-label="Conversation"
        aria-live="polite"
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 text-sm leading-relaxed"
      >
        <p className="max-w-[85%] self-start rounded-2xl rounded-tl-md border border-on-surface/[0.08] bg-container-low px-3.5 py-2.5 text-on-surface/80 dark:border-on-surface/[0.14]">
          Hi! I&apos;m an AI assistant. Ask me anything about {FIRST_NAME}
          &apos;s work, projects and skills.
        </p>

        {messages.map((m, i) =>
          m.role === "user" ? (
            <p
              key={i}
              className="max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-tr-md border border-primary/25 bg-primary/10 px-3.5 py-2.5 text-on-surface"
            >
              {m.content}
            </p>
          ) : (
            <p
              key={i}
              className="max-w-[85%] self-start whitespace-pre-wrap rounded-2xl rounded-tl-md border border-on-surface/[0.08] bg-container-low px-3.5 py-2.5 text-on-surface/80 dark:border-on-surface/[0.14]"
            >
              {m.content ? (
                <RichText text={m.content} />
              ) : (
                <span className="text-faint">Thinking…</span>
              )}
            </p>
          ),
        )}

        {messages.length === 0 && (
          <ul className="mt-1 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button
                  onClick={() => send(s)}
                  className="rounded-full border border-on-surface/[0.12] px-3 py-1.5 text-xs text-mid transition-colors hover:border-primary/40 hover:text-primary dark:border-on-surface/[0.2]"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {atLimit && !loading ? (
        <div className="border-t border-on-surface/[0.06] p-4 text-center text-sm text-mid dark:border-on-surface/[0.12]">
          That&apos;s the limit for one chat.{" "}
          {profile.email && (
            <>
              <a
                href={`mailto:${profile.email}`}
                className="text-primary underline underline-offset-2"
              >
                Email {FIRST_NAME}
              </a>{" "}
              to continue, or{" "}
            </>
          )}
          <button
            onClick={reset}
            className="text-primary underline underline-offset-2"
          >
            start over
          </button>
          .
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="border-t border-on-surface/[0.06] p-3 dark:border-on-surface/[0.12]"
        >
          <div className="flex items-center gap-2 rounded-xl border border-on-surface/[0.1] bg-container-low px-3 py-1.5 focus-within:border-primary/50 dark:border-on-surface/[0.16]">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={LIMITS.userChars}
              placeholder={`Ask about ${FIRST_NAME}…`}
              aria-label="Your question"
              className="ai-input min-w-0 flex-1 bg-transparent py-1.5 text-sm text-on-surface placeholder:text-faint"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="rounded-lg bg-primary p-1.5 text-surface transition-opacity disabled:opacity-40"
            >
              <LuArrowUp aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-faint">{note}</p>
        </form>
      )}
    </div>
  );
}
