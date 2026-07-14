import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Building2,
  ChartNoAxesCombined,
  CircleDot,
  Compass,
  Database,
  DoorOpen,
  Eye,
  Fingerprint,
  KeyRound,
  MessageSquareText,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const useCases = [
  {
    icon: Compass,
    title: "Discover deployed agents",
    body: "Give every employee a legible directory of the agents available across teams, what they do, and where they sit in the organization.",
  },
  {
    icon: ShieldCheck,
    title: "Make access understandable",
    body: "Show why someone can or cannot use an agent, which role grants access, and how to request the access needed for their work.",
  },
  {
    icon: Wrench,
    title: "Expose capability boundaries",
    body: "Make tools, credential scopes, knowledge context, and budgets visible so people understand what an agent can do on their behalf.",
  },
  {
    icon: UsersRound,
    title: "Assemble agent teams",
    body: "Bring an agent or department into a working session, combine specialist perspectives, and keep the human employee at the center.",
  },
];

const pocSteps = [
  {
    number: "01",
    title: "See the organization",
    body: "Maya enters a map where AI agents are visible as part of the company—not scattered across disconnected tools.",
  },
  {
    number: "02",
    title: "Understand the boundary",
    body: "She can inspect Atlas in detail because her roles allow it, while Ledger exposes only a safe public brief.",
  },
  {
    number: "03",
    title: "Work within policy",
    body: "Atlas can chat, search approved knowledge, and consume Maya's agent-specific budget without exposing credential secrets.",
  },
  {
    number: "04",
    title: "Bring agents together",
    body: "From her office, Maya invites Product & Research into a meeting and watches research hand off to planning.",
  },
];

const roadmap = [
  {
    horizon: "Foundation",
    title: "Connect organizational identity",
    accent: "violet",
    items: [
      "SSO, directory, and SCIM integrations",
      "Production RBAC and attribute-based policies",
      "Agent registry and ownership metadata",
      "Access reviews, approvals, and audit history",
    ],
  },
  {
    horizon: "Activation",
    title: "Connect live agents and controls",
    accent: "teal",
    items: [
      "Agent-platform and model-provider adapters",
      "Real chat, tools, and knowledge retrieval",
      "Credential vault and delegated authorization",
      "Token, cost, and rate-limit enforcement",
    ],
  },
  {
    horizon: "Collaboration",
    title: "Operate multi-agent work",
    accent: "magenta",
    items: [
      "Persistent meetings and shared artifacts",
      "Human approvals for consequential actions",
      "Agent handoffs and workflow orchestration",
      "Department templates and reusable teams",
    ],
  },
  {
    horizon: "Intelligence",
    title: "Understand the agent organization",
    accent: "amber",
    items: [
      "Adoption, quality, cost, and risk insights",
      "Coverage gaps and duplicated capabilities",
      "Knowledge and permission health signals",
      "Portfolio planning for deployed agents",
    ],
  },
];

export default function LobbyPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative border-b px-4 py-16 md:px-6 md:py-24">
        <div className="pointer-events-none absolute inset-0 panel-grid opacity-25" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mx-auto mb-7 flex size-14 items-center justify-center border border-primary/35 bg-primary/10 text-primary">
            <DoorOpen className="size-6" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
            Welcome to The Lobby
          </div>
          <h1 className="mx-auto mt-4 max-w-4xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            A front door to the
            <span className="text-primary"> agent-enabled organization</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Agent Office explores how organizations could make AI agents visible, governed, and easy for employees to work with—without hiding capability or control behind a chat box.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/">Explore the organization <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/office">Visit My Office</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Badge>Interactive prototype</Badge>
            <Badge variant="outline">Employee experience</Badge>
            <Badge variant="outline">Mock data only</Badge>
          </div>
        </div>
      </section>

      <section className="border-b px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionLabel icon={Sparkles}>The ultimate vision</SectionLabel>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              The operating map for an organization&apos;s AI workforce
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              As organizations deploy more agents, employees need more than a catalog of chatbots. They need to know who each agent serves, which authority it carries, what systems it can touch, what context it knows, and how to bring it into real work.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              The full Agent Office vision is a shared organizational control plane: part directory, part access layer, part collaboration space, and part living map of deployed AI capability.
            </p>
          </div>

          <div className="relative border bg-card/40 p-5 md:p-7">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <VisionLayer icon={Fingerprint} title="Identity & roles" body="Who is the employee, and what authority do they hold?" />
            <VisionConnector />
            <VisionLayer icon={Bot} title="Agent offices" body="What can each agent do for this employee, with which context and limits?" />
            <VisionConnector />
            <VisionLayer icon={UsersRound} title="Meetings & workflows" body="How can approved agents collaborate while the employee stays in control?" />
            <div className="mt-6 grid grid-cols-3 gap-px border bg-border text-center">
              <VisionMetric icon={Eye} label="Visible" />
              <VisionMetric icon={KeyRound} label="Governed" />
              <VisionMetric icon={Network} label="Connected" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-card/20 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel icon={Building2}>How organizations might use it</SectionLabel>
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              One place to find, understand, and engage organizational agents
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              The interface serves employees first while giving governance teams a clear foundation for future controls.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {useCases.map(({ icon: Icon, title, body }, index) => (
              <Card key={title} className="group relative overflow-hidden bg-card/45 transition-colors hover:border-primary/35">
                <CardHeader>
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center border border-primary/25 bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel icon={Route}>The story this POC tells</SectionLabel>
          <h2 className="mt-4 max-w-2xl font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Follow one employee from discovery to collaboration
          </h2>
          <div className="relative mt-10 grid gap-4 lg:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-secondary/50 via-primary/50 to-primary/20 lg:block" />
            {pocSteps.map((step) => (
              <div key={step.number} className="relative border bg-background p-5">
                <div className="relative z-10 flex size-14 items-center justify-center border border-primary/30 bg-card font-mono text-xs text-primary">
                  {step.number}
                </div>
                <h3 className="mt-6 font-heading text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                <BadgeCheck className="size-3.5" /> What the prototype proves
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
                <CheckItem>Agents can feel like legible organizational resources, not isolated chat windows.</CheckItem>
                <CheckItem>Access and capability boundaries can be explained where employees encounter them.</CheckItem>
                <CheckItem>Multi-agent collaboration can use familiar organizational metaphors.</CheckItem>
              </ul>
            </div>
            <div className="border bg-card/40 p-5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <Database className="size-3.5" /> What is mocked
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <CheckItem muted>Identity, roles, access checks, requests, and token usage.</CheckItem>
                <CheckItem muted>Agent responses, knowledge retrieval, tool execution, and handoffs.</CheckItem>
                <CheckItem muted>All agents, departments, credentials, and organizational context.</CheckItem>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-card/20 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel icon={ChartNoAxesCombined}>Future roadmap</SectionLabel>
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              From illustrative prototype to organizational infrastructure
            </h2>
            <Badge variant="outline">Horizons, not committed dates</Badge>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {roadmap.map((stage, index) => (
              <RoadmapCard key={stage.horizon} stage={stage} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl border border-primary/25 bg-primary/5 p-8 text-center md:p-12">
          <div className="mx-auto flex size-11 items-center justify-center border border-primary/30 bg-background text-primary">
            <MessageSquareText className="size-5" />
          </div>
          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight">The best way to understand it is to walk through it.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Start with the organization map, visit an accessible and restricted agent, then bring Product & Research into your office for a meeting.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link href="/">Enter Agent Office <ArrowRight /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: typeof Sparkles; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
      <Icon className="size-3.5" /> {children}
    </div>
  );
}

function VisionLayer({ icon: Icon, title, body }: { icon: typeof Bot; title: string; body: string }) {
  return (
    <div className="flex items-center gap-4 border bg-background/80 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center border border-primary/25 bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div>
        <h3 className="font-heading text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

function VisionConnector() {
  return (
    <div className="flex h-7 items-center pl-[35px]">
      <div className="h-full w-px bg-gradient-to-b from-primary/70 to-primary/15" />
      <CircleDot className="-ml-[5px] size-2.5 text-primary" />
    </div>
  );
}

function VisionMetric({ icon: Icon, label }: { icon: typeof Eye; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 bg-background px-2 py-3 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
      <Icon className="size-3.5 text-primary" /> {label}
    </div>
  );
}

function CheckItem({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className={`mt-1.5 size-1.5 shrink-0 ${muted ? "bg-muted-foreground" : "bg-primary"}`} />
      <span>{children}</span>
    </li>
  );
}

function RoadmapCard({
  stage,
  index,
}: {
  stage: { horizon: string; title: string; accent: string; items: string[] };
  index: number;
}) {
  const accentClasses: Record<string, string> = {
    violet: "border-violet-400/35 bg-violet-400/10 text-violet-300",
    teal: "border-primary/35 bg-primary/10 text-primary",
    magenta: "border-secondary/35 bg-secondary/10 text-secondary",
    amber: "border-amber-400/35 bg-amber-400/10 text-amber-300",
  };

  return (
    <div className="relative border bg-background p-5">
      <div className="mb-5 flex items-center justify-between">
        <Badge className={accentClasses[stage.accent]}>{stage.horizon}</Badge>
        <span className="font-mono text-[10px] text-muted-foreground">H{index + 1}</span>
      </div>
      <h3 className="min-h-12 font-heading text-base font-semibold">{stage.title}</h3>
      <ul className="mt-4 space-y-3 border-t pt-4">
        {stage.items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <span className="mt-1.5 size-1 shrink-0 bg-muted-foreground" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
