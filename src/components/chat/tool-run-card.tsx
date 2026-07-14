import { CheckCircle2, LoaderCircle, Search } from "lucide-react";
import { tools } from "@/data/tools";
import type { ToolRun } from "@/types/domain";

export function ToolRunCard({ run }: { run: ToolRun }) {
  const tool = tools.find((candidate) => candidate.id === run.toolId);
  const isRunning = run.status === "running";

  return (
    <div className="my-3 overflow-hidden border border-primary/20 bg-background/60">
      <div className="flex items-center justify-between border-b border-primary/15 bg-primary/5 px-3 py-2">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-primary">
          <Search className="size-3" />
          Tool · {tool?.name ?? run.toolId}
        </div>
        {isRunning ? (
          <LoaderCircle className="size-3.5 animate-spin text-primary" />
        ) : (
          <CheckCircle2 className="size-3.5 text-primary" />
        )}
      </div>
      <div className="space-y-2 p-3 text-xs">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Input</span>
          <p className="mt-1 line-clamp-2 text-foreground/80">{run.input}</p>
        </div>
        {run.result && (
          <div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Result</span>
            <p className="mt-1 text-foreground/80">{run.result}</p>
          </div>
        )}
        {run.sources && (
          <div className="flex flex-wrap gap-1.5">
            {run.sources.map((source) => (
              <span key={source} className="border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                {source}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
