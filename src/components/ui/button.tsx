import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "line" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary:
      "bg-warm-white text-near-black shadow-[0_0_28px_rgba(255,247,234,0.24)] hover:bg-white disabled:opacity-50",
    ghost: "border border-ember-line bg-black/30 text-warm-white hover:bg-white/12",
    line: "text-warm-white underlined-action hover:text-white",
    danger: "border border-red-300/40 bg-red-500/15 text-red-100 hover:bg-red-500/25",
  };

  return (
    <button
      className={cn(
        "pixel-frame inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-warm-white/50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
