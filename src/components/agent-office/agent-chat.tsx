"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, LoaderCircle, Sparkles } from "lucide-react";
import type { Agent, Message } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { MessageList } from "@/components/chat/message-list";

export function AgentChat({
  agent,
  messages,
  busy,
  disabled,
  disabledReason,
  onSend,
}: {
  agent: Agent;
  messages: Message[];
  busy: boolean;
  disabled: boolean;
  disabledReason?: string;
  onSend: (input: string) => Promise<void>;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function submit(value: string) {
    const cleanValue = value.trim();
    if (!cleanValue || busy || disabled) return;
    setInput("");
    await onSend(cleanValue);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {messages.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center border border-primary/25 bg-primary/10 text-primary">
              <Bot className="size-5" />
            </div>
            <h3 className="font-heading text-lg font-semibold">Talk with {agent.name}</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Responses and tool calls are simulated for this proof of concept.
            </p>
            <div className="mt-5 grid w-full gap-2">
              {agent.suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void submit(prompt)}
                  disabled={disabled || busy}
                  className="flex items-start gap-2 border bg-card/50 p-3 text-left text-xs leading-relaxed text-foreground/80 transition-colors hover:border-primary/35 hover:bg-primary/5 disabled:opacity-50"
                >
                  <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
        {busy && (
          <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-primary">
            <LoaderCircle className="size-3 animate-spin" /> {agent.name} is working
          </div>
        )}
      </div>

      <form
        className="border-t bg-card/40 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit(input);
        }}
      >
        {disabledReason && <p className="mb-2 text-xs text-amber-300">{disabledReason}</p>}
        <div className="flex items-end gap-2 border bg-background p-2 focus-within:border-primary/40">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submit(input);
              }
            }}
            placeholder={`Message ${agent.name}…`}
            aria-label={`Message ${agent.name}`}
            rows={2}
            disabled={disabled}
            className="max-h-28 min-h-11 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
          <Button type="submit" size="icon" disabled={disabled || busy || !input.trim()} aria-label="Send message">
            {busy ? <LoaderCircle className="animate-spin" /> : <ArrowUp />}
          </Button>
        </div>
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          Mock agent · No external data is sent
        </p>
      </form>
    </div>
  );
}
