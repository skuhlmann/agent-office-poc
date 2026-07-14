"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  Bot,
  Building2,
  Check,
  Clock3,
  DoorOpen,
  LoaderCircle,
  LockKeyhole,
  MessageSquareText,
  Plus,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { agents } from "@/data/agents";
import { departments } from "@/data/departments";
import { roles } from "@/data/roles";
import { currentUser } from "@/data/users";
import { canAccessAgent, getEffectiveTokenPolicy } from "@/lib/access-policy";
import { cn, formatTokenCount } from "@/lib/utils";
import { useDemo } from "@/providers/demo-state-provider";
import { MessageList } from "@/components/chat/message-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function MyOfficePage() {
  const {
    requests,
    usage,
    meeting,
    busyMeetingAgentId,
    toggleMeetingParticipant,
    inviteDepartment,
    sendMeetingMessage,
    endMeeting,
    selectAgent,
  } = useDemo();
  const [meetingInput, setMeetingInput] = useState("");
  const [inviteMode, setInviteMode] = useState<"agents" | "departments">("departments");
  const scrollRef = useRef<HTMLDivElement>(null);
  const userRoles = roles.filter((role) => currentUser.roleIds.includes(role.id));
  const accessibleAgents = agents.filter((agent) => canAccessAgent(currentUser, agent));
  const activeParticipants = agents.filter((agent) => meeting.participantAgentIds.includes(agent.id));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [meeting.messages, busyMeetingAgentId]);

  async function submitMeeting() {
    const value = meetingInput.trim();
    if (!value || busyMeetingAgentId || activeParticipants.length === 0) return;
    setMeetingInput("");
    await sendMeetingMessage(value);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="relative overflow-hidden border-b bg-card/30 px-4 py-7 md:px-6 lg:py-9">
        <div className="pointer-events-none absolute inset-0 panel-grid opacity-30" />
        <div className="relative mx-auto max-w-[1500px]">
          <Button asChild variant="ghost" size="sm" className="mb-5 -ml-3 text-muted-foreground">
            <Link href="/"><ArrowLeft /> Organization map</Link>
          </Button>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="flex items-start gap-4">
              <div className="relative flex size-16 shrink-0 items-center justify-center border border-secondary/35 bg-secondary/10 font-heading text-xl font-semibold text-secondary">
                {currentUser.initials}
                <span className="absolute -right-1 -top-1 size-2 bg-secondary" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-secondary">
                  <DoorOpen className="size-3.5" /> My office
                </div>
                <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">{currentUser.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{currentUser.title} · Meridian Labs</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {userRoles.map((role) => <Badge key={role.id} variant="secondary">{role.name}</Badge>)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-px border bg-border text-center sm:min-w-[420px]">
              <OfficeStat label="Roles" value={userRoles.length} />
              <OfficeStat label="Agents" value={accessibleAgents.length} />
              <OfficeStat label="Pending" value={requests.length} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1500px] gap-5 p-4 md:p-6 xl:grid-cols-[410px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><UsersRound className="size-4 text-primary" /> Invite to meeting</CardTitle>
                  <CardDescription>Add an agent or a whole department.</CardDescription>
                </div>
                <Badge variant="outline">{activeParticipants.length} invited</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 grid grid-cols-2 border bg-background p-1">
                <InviteTab active={inviteMode === "departments"} onClick={() => setInviteMode("departments")} icon={Building2} label="Departments" />
                <InviteTab active={inviteMode === "agents"} onClick={() => setInviteMode("agents")} icon={Bot} label="Agents" />
              </div>

              {inviteMode === "departments" ? (
                <div className="space-y-2">
                  {departments.map((department) => {
                    const departmentAgents = agents.filter((agent) => agent.departmentId === department.id);
                    const eligible = departmentAgents.filter(
                      (agent) => canAccessAgent(currentUser, agent) && agent.status !== "offline",
                    );
                    const alreadyInvited = eligible.length > 0 && eligible.every((agent) => meeting.participantAgentIds.includes(agent.id));
                    return (
                      <button
                        key={department.id}
                        type="button"
                        onClick={() => inviteDepartment(department.id)}
                        disabled={eligible.length === 0 || alreadyInvited}
                        className="group flex w-full items-center gap-3 border bg-card/40 p-3 text-left transition-colors hover:border-primary/35 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center border" style={{ color: department.color, borderColor: `${department.color}55` }}>
                          <Building2 className="size-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-heading text-sm font-medium">{department.name}</div>
                          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                            {eligible.length} available · {departmentAgents.length - eligible.length} unavailable
                          </div>
                        </div>
                        {alreadyInvited ? <Check className="size-4 text-primary" /> : <Plus className="size-4 text-muted-foreground group-hover:text-primary" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {agents.map((agent) => {
                    const accessible = canAccessAgent(currentUser, agent);
                    const unavailable = !accessible || agent.status === "offline";
                    const invited = meeting.participantAgentIds.includes(agent.id);
                    return (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => toggleMeetingParticipant(agent.id)}
                        disabled={unavailable}
                        className={cn(
                          "flex w-full items-center gap-3 border bg-card/40 p-3 text-left transition-colors hover:border-primary/35 disabled:cursor-not-allowed disabled:opacity-40",
                          invited && "border-primary/35 bg-primary/5",
                        )}
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center border bg-background font-heading text-[10px] text-primary">{agent.initials}</div>
                        <div className="min-w-0 flex-1">
                          <div className="font-heading text-sm font-medium">{agent.name}</div>
                          <div className="truncate text-[10px] text-muted-foreground">{agent.title}</div>
                        </div>
                        {!accessible ? <LockKeyhole className="size-3.5" /> : agent.status === "offline" ? <span className="font-mono text-[8px] uppercase">offline</span> : invited ? <Check className="size-4 text-primary" /> : <Plus className="size-4 text-muted-foreground" />}
                      </button>
                    );
                  })}
                </div>
              )}
              <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
                Only agents allowed by your roles can join. Offline agents and restricted offices remain unavailable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Your roles</CardTitle>
              <CardDescription>Roles determine which agent offices you may enter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {userRoles.map((role) => {
                const grantedCount = agents.filter((agent) => agent.allowedRoleIds.includes(role.id)).length;
                return (
                  <div key={role.id} className="border bg-card/40 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-heading text-sm font-medium">{role.name}</h3>
                      <Badge>{grantedCount} agents</Badge>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{role.description}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </aside>

        <div className="min-w-0 space-y-5">
          <Card className="flex min-h-[660px] flex-col overflow-hidden xl:h-[calc(100vh-7rem)] xl:min-h-[700px]">
            <CardHeader className="border-b bg-card/40">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                    <span className={cn("size-1.5", busyMeetingAgentId ? "animate-signal-pulse bg-primary" : "bg-muted-foreground")} /> Meeting room
                  </div>
                  <CardTitle className="mt-1 text-xl">Agent working session</CardTitle>
                  <CardDescription>Invite agents, ask one question, and watch the handoffs.</CardDescription>
                </div>
                {activeParticipants.length > 0 && (
                  <Button size="sm" variant="ghost" onClick={endMeeting} disabled={Boolean(busyMeetingAgentId)}>
                    <X /> End meeting
                  </Button>
                )}
              </div>
              <div className="mt-4 flex min-h-10 flex-wrap items-center gap-2 border-t pt-4">
                {activeParticipants.length === 0 ? (
                  <span className="text-xs text-muted-foreground">No agents invited yet.</span>
                ) : (
                  activeParticipants.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => selectAgent(agent.id)}
                      className="flex items-center gap-2 border border-primary/20 bg-primary/5 px-2 py-1.5 text-xs transition-colors hover:border-primary/45"
                      title={`Open ${agent.name}'s office`}
                    >
                      <span className="flex size-5 items-center justify-center bg-primary/10 font-heading text-[8px] text-primary">{agent.initials}</span>
                      {agent.name}
                      {busyMeetingAgentId === agent.id && <LoaderCircle className="size-3 animate-spin text-primary" />}
                    </button>
                  ))
                )}
              </div>
            </CardHeader>

            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
              {meeting.messages.length === 0 ? (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                  <div className="flex size-14 items-center justify-center border border-primary/25 bg-primary/10 text-primary">
                    <MessageSquareText className="size-6" />
                  </div>
                  <h2 className="mt-5 font-heading text-xl font-semibold">
                    {activeParticipants.length ? "The room is ready" : "Bring agents into your office"}
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {activeParticipants.length
                      ? "Ask the group to investigate a question, compare perspectives, or turn research into a plan."
                      : "Invite an individual agent or a department to begin a governed multi-agent working session."}
                  </p>
                  {activeParticipants.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setMeetingInput("Search our knowledge for onboarding friction, then propose a focused improvement plan.")}
                      className="mt-5 flex max-w-md items-start gap-2 border bg-card/50 p-3 text-left text-xs leading-relaxed text-foreground/80 transition-colors hover:border-primary/35 hover:bg-primary/5"
                    >
                      <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      Search our knowledge for onboarding friction, then propose a focused improvement plan.
                    </button>
                  )}
                </div>
              ) : (
                <MessageList messages={meeting.messages} className="mx-auto max-w-3xl" />
              )}
              {busyMeetingAgentId && (
                <div className="mx-auto mt-4 flex max-w-3xl items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-primary">
                  <LoaderCircle className="size-3 animate-spin" />
                  {agents.find((agent) => agent.id === busyMeetingAgentId)?.name} is adding perspective
                </div>
              )}
            </div>

            <form
              className="border-t bg-card/40 p-4"
              onSubmit={(event) => {
                event.preventDefault();
                void submitMeeting();
              }}
            >
              <div className="mx-auto flex max-w-3xl items-end gap-2 border bg-background p-2 focus-within:border-primary/45">
                <textarea
                  value={meetingInput}
                  onChange={(event) => setMeetingInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void submitMeeting();
                    }
                  }}
                  disabled={activeParticipants.length === 0 || Boolean(busyMeetingAgentId)}
                  rows={2}
                  placeholder={activeParticipants.length ? "Ask the meeting…" : "Invite at least one agent to begin…"}
                  className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!meetingInput.trim() || activeParticipants.length === 0 || Boolean(busyMeetingAgentId)}
                  aria-label="Send to meeting"
                >
                  {busyMeetingAgentId ? <LoaderCircle className="animate-spin" /> : <ArrowUp />}
                </Button>
              </div>
              <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                Responses, tool runs, and token usage are simulated
              </p>
            </form>
          </Card>

          <section className="grid gap-5 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="size-4 text-primary" /> Accessible offices</CardTitle>
                <CardDescription>Your usage and budget are specific to each agent.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {accessibleAgents.map((agent) => {
                  const policy = getEffectiveTokenPolicy(currentUser, agent);
                  const used = usage[agent.id] ?? 0;
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => selectAgent(agent.id)}
                      className="w-full border bg-card/40 p-3 text-left transition-colors hover:border-primary/35"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <span className="font-heading text-sm font-medium">{agent.name}</span>
                          <span className="ml-2 text-[10px] text-muted-foreground">{agent.title}</span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">{formatTokenCount(used)} / {formatTokenCount(policy.dailyLimit)}</span>
                      </div>
                      <Progress value={(used / policy.dailyLimit) * 100} className="mt-2" />
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock3 className="size-4 text-amber-300" /> Access requests</CardTitle>
                <CardDescription>Requests stay pending in this employee-side POC.</CardDescription>
              </CardHeader>
              <CardContent>
                {requests.length ? (
                  <div className="space-y-2">
                    {requests.map((request) => {
                      const agent = agents.find((candidate) => candidate.id === request.agentId);
                      return (
                        <button
                          key={request.id}
                          type="button"
                          onClick={() => agent && selectAgent(agent.id)}
                          className="flex w-full items-start gap-3 border border-amber-400/15 bg-amber-400/5 p-3 text-left"
                        >
                          <Clock3 className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-heading text-sm font-medium">{agent?.name}</span>
                              <Badge variant="warning">Pending</Badge>
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{request.reason}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-32 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                    <Check className="mb-2 size-5 text-primary" /> No pending requests
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

function OfficeStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background/90 px-4 py-3">
      <div className="font-heading text-xl font-semibold text-foreground">{value}</div>
      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function InviteTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Bot;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 items-center justify-center gap-2 font-heading text-xs text-muted-foreground transition-colors",
        active && "bg-card text-foreground",
      )}
    >
      <Icon className="size-3.5" /> {label}
    </button>
  );
}
