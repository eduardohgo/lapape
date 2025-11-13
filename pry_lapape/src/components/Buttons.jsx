"use client";
import { cn } from "@/lib/utils";

const theme = { primary:"#FFD54F", secondary:"#4A90E2", inkStrong:"#1C1C1C" };

export function PrimaryButton({ className, children, ...props }) {
  return (
    <button {...props}
      className={cn("inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[30px] font-bold shadow-sm", className)}
      style={{ background: theme.primary, color: theme.inkStrong }}>
      {children}
    </button>
  );
}

export function SecondaryButton({ className, children, ...props }) {
  return (
    <button {...props}
      className={cn("inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[30px] font-bold border-2", className)}
      style={{ borderColor: theme.secondary, color: theme.secondary, background: "#fff" }}>
      {children}
    </button>
  );
}
