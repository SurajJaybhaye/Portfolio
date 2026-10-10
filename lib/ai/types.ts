export type ChatMessage = { role: "user" | "assistant"; content: string };

// Every provider (Claude, an OpenAI-compatible API, or the built-in demo) implements this.
// To add a new provider, write one of these and select it in provider.ts.
export interface ChatProvider {
  name: string;
  // false for the built-in demo, which answers from a local FAQ and calls no API.
  live: boolean;
  stream(
    messages: ChatMessage[],
    system: string,
    signal?: AbortSignal,
  ): AsyncGenerator<string>;
}
