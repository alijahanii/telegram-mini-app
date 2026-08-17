"use client";

import { cn } from "@/lib/format";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-l from-[#2AABEE] to-[#5B6FEE] text-white shadow-[0_8px_24px_-6px_rgba(43,150,238,0.6)] hover:brightness-110 active:brightness-95",
  secondary:
    "bg-gradient-to-l from-[#7C3AED] to-[#2AABEE] text-white shadow-[0_8px_24px_-6px_rgba(124,58,237,0.5)] hover:brightness-110",
  outline:
    "border border-white/15 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm",
  ghost: "text-slate-200 hover:bg-white/5",
  danger: "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-xs rounded-xl",
  md: "h-11 px-4 text-sm rounded-2xl",
  lg: "h-[52px] px-6 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", fullWidth, loading, disabled, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none min-h-[44px]",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
