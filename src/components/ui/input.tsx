import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "pixel-frame h-12 w-full border border-ember-line bg-black/24 px-4 text-sm text-warm-white outline-none transition placeholder:text-ash-muted/70 focus:border-warm-white/70",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "pixel-frame min-h-32 w-full border border-ember-line bg-black/24 px-4 py-3 text-sm leading-6 text-warm-white outline-none transition placeholder:text-ash-muted/70 focus:border-warm-white/70",
        className,
      )}
      {...props}
    />
  );
}
