import { Bot, UserRound } from "lucide-react";
import { agents } from "@/data/agents";
import { currentUser } from "@/data/users";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/domain";
import { ToolRunCard } from "@/components/chat/tool-run-card";

export function MessageList({ messages, className }: { messages: Message[]; className?: string }) {
  return (
    <div className={cn("space-y-4", className)} aria-live="polite">
      {messages.map((message) => {
        const isUser = message.senderType === "user";
        const agent = agents.find((candidate) => candidate.id === message.senderId);
        const sender = isUser ? currentUser.name : agent?.name ?? "System";

        return (
          <article key={message.id} className={cn("flex gap-3", isUser && "flex-row-reverse")}>
            <div
              className={cn(
                "mt-0.5 flex size-7 shrink-0 items-center justify-center border",
                isUser
                  ? "border-secondary/25 bg-secondary/10 text-secondary"
                  : "border-primary/25 bg-primary/10 text-primary",
              )}
            >
              {isUser ? <UserRound className="size-3.5" /> : <Bot className="size-3.5" />}
            </div>
            <div className={cn("min-w-0 max-w-[88%]", isUser && "text-right")}>
              <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                {sender}
              </div>
              <div
                className={cn(
                  "border px-3 py-2.5 text-left text-sm leading-relaxed",
                  isUser ? "border-secondary/15 bg-secondary/5" : "border-border bg-card/70",
                )}
              >
                {message.toolRun && <ToolRunCard run={message.toolRun} />}
                <p>{message.content}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
