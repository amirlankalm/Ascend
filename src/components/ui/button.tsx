import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "line" | "danger";
};

const variants = {
  primary: "border border-warm-white bg-warm-white text-near-black hover:opacity-85 disabled:opacity-50",
  ghost: "border border-ember-line bg-transparent text-ash-muted hover:border-warm-white hover:text-warm-white",
  line: "text-warm-white underlined-action hover:text-white",
  danger: "border border-warm-white bg-transparent text-warm-white hover:bg-warm-white hover:text-near-black",
};

export function buttonClassName({
  variant = "primary",
  className,
}: {
  variant?: ButtonProps["variant"];
  className?: string;
} = {}) {
  return cn(
    "pixel-frame inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-normal lowercase tracking-[-0.02em] transition duration-150 active:translate-y-px disabled:translate-y-0 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-warm-white",
    variants[variant],
    className,
  );
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={buttonClassName({ variant, className })}
      {...props}
    />
  );
}
