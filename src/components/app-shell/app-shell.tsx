"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Building2, RotateCcw, UserRound } from "lucide-react";
import { currentUser } from "@/data/users";
import { roles } from "@/data/roles";
import { useDemo } from "@/providers/demo-state-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentOfficePanel } from "@/components/agent-office/agent-office-panel";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resetDemo } = useDemo();
  const userRoles = roles.filter((role) => currentUser.roleIds.includes(role.id));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex items-center gap-3" aria-label="Agent Office home">
            <div className="relative flex size-8 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
              <Building2 className="size-4" />
              <span className="absolute -right-1 -top-1 size-1.5 bg-secondary" />
            </div>
            <div>
              <div className="font-heading text-sm font-semibold uppercase tracking-[0.16em]">Agent Office</div>
              <div className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
                Meridian Labs · AI directory
              </div>
            </div>
          </Link>
          <div className="mx-2 hidden h-6 w-px bg-border lg:block" />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            <Button asChild size="sm" variant={pathname === "/" ? "outline" : "ghost"}>
              <Link href="/">Organization</Link>
            </Button>
            <Button asChild size="sm" variant={pathname === "/office" ? "outline" : "ghost"}>
              <Link href="/office">My Office</Link>
            </Button>
            <Button asChild size="sm" variant={pathname === "/lobby" ? "outline" : "ghost"}>
              <Link href="/lobby">The Lobby</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetDemo}
            className="hidden text-muted-foreground md:inline-flex"
          >
            <RotateCcw /> Reset demo
          </Button>
          <Button
            asChild
            variant={pathname === "/lobby" ? "outline" : "ghost"}
            size="icon"
            className="lg:hidden"
          >
            <Link href="/lobby" aria-label="Open The Lobby">
              <BookOpenText />
            </Link>
          </Button>
          <Link
            href="/office"
            className={cn(
              "flex items-center gap-2 border px-2 py-1.5 transition-colors hover:border-primary/40 hover:bg-primary/5",
              pathname === "/office" && "border-primary/40 bg-primary/5",
            )}
          >
            <div className="flex size-7 items-center justify-center bg-primary/10 font-heading text-xs font-semibold text-primary">
              {currentUser.initials}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-medium leading-none">{currentUser.name}</div>
              <div className="mt-1 flex items-center gap-1">
                {userRoles.slice(0, 2).map((role) => (
                  <Badge key={role.id} variant="outline" className="border-0 p-0 text-[8px]">
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>
            <UserRound className="hidden size-3.5 text-muted-foreground md:block" />
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <AgentOfficePanel />
    </div>
  );
}
