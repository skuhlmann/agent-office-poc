"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Bot,
  BrainCircuit,
  Check,
  Clock3,
  Database,
  KeyRound,
  LockKeyhole,
  MessageSquareText,
  Send,
  ShieldCheck,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { agents } from "@/data/agents";
import { credentials, knowledgeSources, tools } from "@/data/tools";
import { departments } from "@/data/departments";
import { roles } from "@/data/roles";
import { currentUser } from "@/data/users";
import {
  canSendMessage,
  getAccessState,
  getEffectiveTokenPolicy,
} from "@/lib/access-policy";
import { cn, formatTokenCount } from "@/lib/utils";
import { useDemo } from "@/providers/demo-state-provider";
import { AccessStatus } from "@/components/access/access-status";
import { AgentChat } from "@/components/agent-office/agent-chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type PanelTab = "overview" | "capabilities" | "chat";

export function AgentOfficePanel() {
  const {
    selectedAgentId,
    selectAgent,
    requests,
    usage,
    conversations,
    busyAgentId,
    requestAccess,
    sendAgentMessage,
  } = useDemo();
  const [tab, setTab] = useState<PanelTab>("overview");
  const [reason, setReason] = useState("");
  const agent = agents.find((candidate) => candidate.id === selectedAgentId);

  useEffect(() => {
    setTab("overview");
    setReason("");
  }, [selectedAgentId]);

  if (!agent) return null;

  const department = departments.find((candidate) => candidate.id === agent.departmentId);
  const accessState = getAccessState(currentUser, agent, requests);
  const requiredRoles = roles.filter((role) => agent.allowedRoleIds.includes(role.id));
  const policy = getEffectiveTokenPolicy(currentUser, agent);
  const usedTokens = usage[agent.id] ?? 0;
  const usagePercent = (usedTokens / policy.dailyLimit) * 100;
  const hasAccess = accessState === "granted";
  const allowedToChat = canSendMessage(currentUser, agent, usedTokens);
  const agentTools = tools.filter((tool) => agent.toolIds.includes(tool.id));
  const agentCredentials = credentials.filter((credential) => agent.credentialIds.includes(credential.id));
  const agentKnowledge = knowledgeSources.filter((source) => agent.knowledgeSourceIds.includes(source.id));
  const messages = conversations[agent.id] ?? [];

  let chatDisabledReason: string | undefined;
  if (agent.status === "offline") chatDisabledReason = `${agent.name} is currently offline.`;
  else if (usedTokens >= policy.dailyLimit) chatDisabledReason = "Your daily token allowance has been reached.";

  return (
    <Dialog.Root open onOpenChange={(open) => !open && selectAgent(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[520px] flex-col border-l bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <Dialog.Title className="sr-only">{agent.name} agent office</Dialog.Title>
          <Dialog.Description className="sr-only">
            Review this agent&apos;s capabilities, access, and chat controls.
          </Dialog.Description>

          <header className="relative border-b bg-card/40 px-5 pb-5 pt-6">
            <div className="absolute left-0 top-0 h-px w-2/3 bg-gradient-to-r from-primary via-primary/40 to-transparent" />
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="absolute right-3 top-3" aria-label="Close agent office">
                <X />
              </Button>
            </Dialog.Close>
            <div className="flex items-start gap-4 pr-10">
              <div className="relative flex size-14 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 font-heading text-lg font-semibold text-primary">
                {agent.initials}
                <span
                  className={cn(
                    "absolute -bottom-1 -right-1 size-2.5 border-2 border-background",
                    agent.status === "online" && "bg-primary",
                    agent.status === "busy" && "bg-amber-400",
                    agent.status === "offline" && "bg-muted-foreground",
                  )}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{department?.shortName}</Badge>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    {agent.status}
                  </span>
                </div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight">{agent.name}</h2>
                <p className="text-sm text-muted-foreground">{agent.title}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <AccessStatus state={accessState} />
              <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                Agent ID · {agent.id}
              </div>
            </div>
          </header>

          <nav className="grid grid-cols-3 border-b bg-card/20 p-1" aria-label="Agent office sections">
            {(
              [
                ["overview", "Overview", Bot],
                ["capabilities", "Capabilities", Wrench],
                ["chat", "Chat", MessageSquareText],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                disabled={id === "chat" && !hasAccess}
                className={cn(
                  "flex h-9 items-center justify-center gap-2 border border-transparent font-heading text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35",
                  tab === id && "border-border bg-background text-foreground",
                )}
              >
                <Icon className="size-3.5" /> {label}
              </button>
            ))}
          </nav>

          <div className="min-h-0 flex-1 overflow-hidden">
            {tab === "overview" && (
              <div className="h-full overflow-y-auto px-5 py-5">
                <section>
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Office brief</div>
                  <p className="text-sm leading-relaxed text-foreground/80">{agent.summary}</p>
                </section>

                <section className="mt-6">
                  <h3 className="mb-3 font-heading text-sm font-semibold">What {agent.name} can help with</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(hasAccess ? agent.capabilities : agent.publicCapabilities).map((capability) => (
                      <div key={capability} className="flex items-start gap-2 border bg-card/40 p-3 text-xs text-foreground/80">
                        <Zap className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        {capability}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-6 border-t pt-5">
                  <h3 className="font-heading text-sm font-semibold">Roles with access</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Employees need any one of these roles to enter this office.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {requiredRoles.map((role) => (
                      <Badge key={role.id} variant={currentUser.roleIds.includes(role.id) ? "default" : "outline"}>
                        {currentUser.roleIds.includes(role.id) && <Check className="mr-1 size-3" />}
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </section>

                {accessState === "restricted" && (
                  <section className="mt-6 border border-muted-foreground/20 bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                      <LockKeyhole className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <h3 className="font-heading text-sm font-semibold">This office is restricted</h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          You can review the public brief, but tools, context, credentials, and chat remain private.
                        </p>
                      </div>
                    </div>
                    <form
                      className="mt-4"
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (!reason.trim()) return;
                        requestAccess(agent.id, reason.trim());
                        setReason("");
                      }}
                    >
                      <label htmlFor="access-reason" className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                        Why do you need access?
                      </label>
                      <textarea
                        id="access-reason"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        rows={3}
                        placeholder="Describe the work you need this agent for…"
                        className="mt-2 w-full resize-none border bg-background p-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
                      />
                      <Button type="submit" className="mt-3 w-full" disabled={!reason.trim()}>
                        <Send /> Request access
                      </Button>
                    </form>
                  </section>
                )}

                {accessState === "pending" && (
                  <section className="mt-6 border border-amber-400/20 bg-amber-400/5 p-4">
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 size-4 shrink-0 text-amber-300" />
                      <div>
                        <h3 className="font-heading text-sm font-semibold text-amber-100">Access request pending</h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          Your request is recorded. Chat and private capability details stay locked until access is granted.
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {hasAccess && (
                  <section className="mt-6 border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                        <div>
                          <h3 className="font-heading text-sm font-semibold">Your role grants access</h3>
                          <p className="mt-1 text-xs text-muted-foreground">Tools run within {agent.name}&apos;s approved scope.</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => setTab("chat")} disabled={agent.status === "offline"}>
                        Open chat
                      </Button>
                    </div>
                  </section>
                )}
              </div>
            )}

            {tab === "capabilities" && (
              <div className="h-full overflow-y-auto px-5 py-5">
                {hasAccess ? (
                  <div className="space-y-7">
                    <section>
                      <div className="mb-3 flex items-end justify-between">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Daily allowance</div>
                          <h3 className="mt-1 font-heading text-base font-semibold">Your token budget</h3>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <span className="text-foreground">{formatTokenCount(usedTokens)}</span>
                          <span className="text-muted-foreground"> / {formatTokenCount(policy.dailyLimit)}</span>
                        </div>
                      </div>
                      <Progress value={usagePercent} />
                      <p className="mt-2 text-[11px] text-muted-foreground">Resets daily · Specific to you + {agent.name}</p>
                    </section>

                    <CapabilityList icon={Wrench} label="Approved tools">
                      {agentTools.map((tool) => (
                        <CapabilityRow key={tool.id} title={tool.name} detail={tool.description}>
                          <Badge variant={tool.risk === "moderate" ? "warning" : "outline"}>{tool.risk} risk</Badge>
                        </CapabilityRow>
                      ))}
                    </CapabilityList>

                    <CapabilityList icon={BrainCircuit} label="Knowledge context">
                      {agentKnowledge.map((source) => (
                        <CapabilityRow key={source.id} title={source.name} detail={source.description}>
                          <span className="font-mono text-[9px] text-muted-foreground">{source.freshness}</span>
                        </CapabilityRow>
                      ))}
                    </CapabilityList>

                    <CapabilityList icon={KeyRound} label="Credential access">
                      {agentCredentials.map((credential) => (
                        <CapabilityRow
                          key={credential.id}
                          title={credential.name}
                          detail={`${credential.service} · ${credential.scope}`}
                        >
                          <Badge variant={credential.availability === "available" ? "default" : "warning"}>
                            {credential.availability}
                          </Badge>
                        </CapabilityRow>
                      ))}
                    </CapabilityList>
                    <div className="flex items-start gap-2 border border-border bg-card/30 p-3 text-[11px] leading-relaxed text-muted-foreground">
                      <Database className="mt-0.5 size-3.5 shrink-0" />
                      Credential names and scopes are shown for transparency. Secret values are never exposed to employees or chat.
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                    <LockKeyhole className="size-8 text-muted-foreground" />
                    <h3 className="mt-4 font-heading text-lg font-semibold">Private capability details</h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                      Tool configuration, knowledge sources, credentials, and budgets are visible after access is granted.
                    </p>
                    <div className="mt-4"><AccessStatus state={accessState} /></div>
                  </div>
                )}
              </div>
            )}

            {tab === "chat" && hasAccess && (
              <AgentChat
                agent={agent}
                messages={messages}
                busy={busyAgentId === agent.id}
                disabled={!allowedToChat}
                disabledReason={chatDisabledReason}
                onSend={(input) => sendAgentMessage(agent.id, input)}
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CapabilityList({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Wrench;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
        <Icon className="size-3.5" /> {label}
      </div>
      <div className="divide-y border">{children}</div>
    </section>
  );
}

function CapabilityRow({
  title,
  detail,
  children,
}: {
  title: string;
  detail: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 bg-card/35 p-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
