"use client";

import { DoorOpen } from "lucide-react";
import { departments } from "@/data/departments";
import { roles } from "@/data/roles";
import { currentUser } from "@/data/users";
import { getAccessState } from "@/lib/access-policy";
import { useDemo } from "@/providers/demo-state-provider";
import type { Agent } from "@/types/domain";
import { AccessStatus } from "@/components/access/access-status";
import { Badge } from "@/components/ui/badge";

export function MobileAgentList({ agents }: { agents: Agent[] }) {
  const { requests, selectAgent } = useDemo();

  return (
    <div className="space-y-6 p-4 lg:hidden">
      {departments.map((department) => {
        const departmentAgents = agents.filter((agent) => agent.departmentId === department.id);
        if (departmentAgents.length === 0) return null;
        return (
          <section key={department.id}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-heading text-xs font-semibold uppercase tracking-wider">{department.name}</h2>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{departmentAgents.length} agents</span>
            </div>
            <div className="divide-y border">
              {departmentAgents.map((agent) => {
                const accessState = getAccessState(currentUser, agent, requests);
                const role = roles.find((candidate) => agent.allowedRoleIds.includes(candidate.id));
                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => selectAgent(agent.id)}
                    className="flex w-full items-center gap-3 bg-card/40 p-3 text-left transition-colors hover:bg-card/80"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center border bg-primary/5 font-heading text-xs text-primary">
                      {agent.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-sm font-semibold">{agent.name}</h3>
                        <span className={`size-1.5 ${agent.status === "online" ? "bg-primary" : agent.status === "busy" ? "bg-amber-400" : "bg-muted-foreground"}`} />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{agent.title}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge variant="outline">{role?.name}</Badge>
                        <AccessStatus state={accessState} />
                      </div>
                    </div>
                    <DoorOpen className="size-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
