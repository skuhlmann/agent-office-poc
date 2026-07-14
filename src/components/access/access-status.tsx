import { CircleCheck, Clock3, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccessState } from "@/types/domain";

const statusContent = {
  granted: { label: "Access granted", Icon: CircleCheck, className: "text-primary" },
  restricted: { label: "Restricted", Icon: LockKeyhole, className: "text-muted-foreground" },
  pending: { label: "Request pending", Icon: Clock3, className: "text-amber-300" },
};

export function AccessStatus({ state, compact = false }: { state: AccessState; compact?: boolean }) {
  const { label, Icon, className } = statusContent[state];
  return (
    <div className={cn("inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider", className)}>
      <Icon className="size-3" aria-hidden="true" />
      {!compact && <span>{label}</span>}
      <span className="sr-only">{compact ? label : ""}</span>
    </div>
  );
}
