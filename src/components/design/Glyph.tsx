import { cn } from "@/lib/utils";

type GlyphName =
  | "ascend"
  | "graph"
  | "quest"
  | "proof"
  | "portfolio"
  | "radar"
  | "bell"
  | "bolt"
  | "command"
  | "check"
  | "close"
  | "clock"
  | "copy"
  | "arrow"
  | "lock"
  | "skill"
  | "grant"
  | "milestone"
  | "scan"
  | "target"
  | "file"
  | "link";

const glyphs: Record<GlyphName, string[]> = {
  ascend: ["00100", "01110", "10101", "00100", "01110"],
  graph: ["10001", "01010", "00100", "01010", "10001"],
  quest: ["11100", "10110", "11101", "00110", "00111"],
  proof: ["11110", "10010", "11110", "10000", "11111"],
  portfolio: ["01110", "11111", "10001", "11111", "11111"],
  radar: ["00100", "01010", "10101", "01010", "00100"],
  bell: ["00100", "01110", "01110", "11111", "00100"],
  bolt: ["00110", "01100", "11110", "00110", "01100"],
  command: ["10101", "01110", "11111", "01110", "10101"],
  check: ["00001", "00010", "10100", "01000", "00100"],
  close: ["10001", "01010", "00100", "01010", "10001"],
  clock: ["01110", "10001", "10111", "10000", "01110"],
  copy: ["11100", "10100", "11111", "00101", "00111"],
  arrow: ["00100", "00010", "11111", "00010", "00100"],
  lock: ["01110", "10001", "11111", "11011", "11111"],
  skill: ["00100", "10101", "01110", "10101", "00100"],
  grant: ["01110", "11111", "10101", "11111", "01110"],
  milestone: ["00100", "01110", "11111", "01110", "00100"],
  scan: ["11111", "00000", "01110", "00000", "11111"],
  target: ["01110", "10001", "10101", "10001", "01110"],
  file: ["11110", "10010", "10110", "10000", "11111"],
  link: ["01100", "10010", "00100", "01001", "00110"],
};

export function Glyph({
  name,
  className,
  size = "md",
}: {
  name: GlyphName;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const sizeClass = {
    xs: "h-3.5 w-3.5 gap-[1px]",
    sm: "h-4 w-4 gap-[1px]",
    md: "h-5 w-5 gap-[1.5px]",
    lg: "h-7 w-7 gap-[2px]",
    xl: "h-10 w-10 gap-[3px]",
  }[size];

  return (
    <span className={cn("inline-grid grid-cols-5 grid-rows-5 align-middle", sizeClass, className)} aria-hidden="true">
      {glyphs[name].join("").split("").map((cell, index) => (
        <span
          key={`${name}-${index}`}
          className={cn(
            "block min-h-0 min-w-0 transition",
            cell === "1" ? "bg-current" : "bg-transparent",
          )}
        />
      ))}
    </span>
  );
}

export type { GlyphName };
