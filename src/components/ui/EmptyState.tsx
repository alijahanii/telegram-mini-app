import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
        {icon ?? "📭"}
      </div>
      <p className="mb-1 text-sm font-semibold text-white">{title}</p>
      {description && <p className="mb-4 text-xs text-slate-400">{description}</p>}
      {action}
    </div>
  );
}
