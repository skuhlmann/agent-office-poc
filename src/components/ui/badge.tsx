import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        default: "border-primary/25 bg-primary/10 text-primary",
        secondary: "border-secondary/25 bg-secondary/10 text-secondary",
        destructive: "border-destructive/25 bg-destructive/10 text-destructive",
        outline: "border-border bg-card/50 text-muted-foreground",
        violet: "border-violet-400/25 bg-violet-400/10 text-violet-300",
        warning: "border-amber-400/25 bg-amber-400/10 text-amber-300",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
