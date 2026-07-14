import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeValue)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all",
          safeValue >= 90 ? "bg-destructive" : "bg-primary",
        )}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
