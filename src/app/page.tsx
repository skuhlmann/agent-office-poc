"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bot, Building2, Search, SlidersHorizontal, UserRound } from "lucide-react";
import { agents } from "@/data/agents";
import { departments } from "@/data/departments";
import { roles } from "@/data/roles";
import { currentUser } from "@/data/users";
import { getAccessState } from "@/lib/access-policy";
import { useDemo } from "@/providers/demo-state-provider";
import { OrganizationChart } from "@/components/org-chart/organization-chart";
import { MobileAgentList } from "@/components/org-chart/mobile-agent-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OrganizationPage() {
  const { requests } = useDemo();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [access, setAccess] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return agents.filter((agent) => {
      const agentRoles = roles.filter((role) => agent.allowedRoleIds.includes(role.id));
      const haystack = [agent.name, agent.title, agent.summary, ...agentRoles.map((role) => role.name)]
        .join(" ")
        .toLowerCase();
      const accessState = getAccessState(currentUser, agent, requests);
      return (
        (!query || haystack.includes(query)) &&
        (department === "all" || agent.departmentId === department) &&
        (access === "all" || accessState === access) &&
        (status === "all" || agent.status === status)
      );
    });
  }, [search, department, access, status, requests]);

  const accessibleCount = agents.filter(
    (agent) => getAccessState(currentUser, agent, requests) === "granted",
  ).length;
  const pendingCount = agents.filter(
    (agent) => getAccessState(currentUser, agent, requests) === "pending",
  ).length;

  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-[620px] flex-col">
      <section className="z-10 border-b bg-background/95 px-4 py-4 md:px-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              <span className="size-1.5 animate-signal-pulse bg-primary" /> Live organization map
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Your AI organization</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline"><Bot className="mr-1 size-3" /> {agents.length} agents</Badge>
                <Badge variant="outline"><Building2 className="mr-1 size-3" /> {departments.length} departments</Badge>
                <Badge><span className="mr-1">{accessibleCount}</span> accessible</Badge>
                {pendingCount > 0 && <Badge variant="warning">{pendingCount} pending</Badge>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1 xl:flex-none">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search agents or roles…"
                className="h-9 w-full border bg-card/40 pl-9 pr-3 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/45 xl:w-[250px]"
              />
            </div>
            <FilterSelect value={department} onChange={setDepartment} label="Department">
              <option value="all">All departments</option>
              {departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </FilterSelect>
            <FilterSelect value={access} onChange={setAccess} label="Access">
              <option value="all">All access</option>
              <option value="granted">Accessible</option>
              <option value="restricted">Restricted</option>
              <option value="pending">Pending</option>
            </FilterSelect>
            <FilterSelect value={status} onChange={setStatus} label="Status">
              <option value="all">All status</option>
              <option value="online">Online</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </FilterSelect>
            <Button asChild size="sm" variant="outline" className="lg:hidden">
              <Link href="/office"><UserRound /> My office</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative min-h-0 flex-1">
        {filteredAgents.length > 0 ? (
          <>
            <div className="hidden h-full lg:block">
              <OrganizationChart agents={filteredAgents} />
              <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 border bg-background/90 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground backdrop-blur">
                <LegendDot className="bg-primary" label="Accessible" />
                <LegendDot className="bg-amber-400" label="Pending" />
                <LegendDot className="bg-muted-foreground" label="Restricted" />
                <span className="hidden border-l pl-4 xl:inline">Select an agent to enter its office</span>
              </div>
            </div>
            <MobileAgentList agents={filteredAgents} />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <SlidersHorizontal className="size-8 text-muted-foreground" />
            <h2 className="mt-4 font-heading text-lg font-semibold">No agents match these filters</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try clearing a filter or using a broader search.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setDepartment("all");
                setAccess("all");
                setStatus("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 appearance-none border bg-card/40 py-0 pl-3 pr-7 text-xs text-foreground outline-none focus:border-primary/45"
      >
        {children}
      </select>
      <SlidersHorizontal className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
    </label>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-1.5 ${className}`} /> {label}
    </span>
  );
}
