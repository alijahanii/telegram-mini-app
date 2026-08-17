import { cn } from "@/lib/format";
import { HTMLAttributes } from "react";

type Tone = "blue" | "purple" | "green" | "amber" | "red" | "slate";

const toneClasses: Record<Tone, string> = {
  blue: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
  slate: "bg-white/10 text-slate-300 border-white/15",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "slate", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
