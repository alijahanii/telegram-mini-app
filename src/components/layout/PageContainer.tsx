import { ReactNode } from "react";
import { cn } from "@/lib/format";

export function PageContainer({
  children,
  className,
  noPadBottom,
}: {
  children: ReactNode;
  className?: string;
  noPadBottom?: boolean;
}) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-lg px-4 pt-4",
        !noPadBottom && "pb-[calc(96px+env(safe-area-inset-bottom))]",
        className,
      )}
    >
      {children}
    </main>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[15px] font-bold text-white">{title}</h2>
      {action && (
        <a href={action.href} className="text-xs font-medium text-sky-400 active:opacity-70">
          {action.label}
        </a>
      )}
    </div>
  );
}
