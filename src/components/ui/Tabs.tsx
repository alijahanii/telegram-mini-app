"use client";

import { cn } from "@/lib/format";

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "no-scrollbar flex gap-2 overflow-x-auto pb-1",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              "flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-all active:scale-95",
              active
                ? "bg-gradient-to-l from-[#2AABEE] to-[#5B6FEE] text-white shadow-[0_6px_18px_-4px_rgba(43,150,238,0.6)]"
                : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]",
            )}
          >
            {item.label}
            {typeof item.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px]",
                  active ? "bg-white/20" : "bg-white/10 text-slate-400",
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
