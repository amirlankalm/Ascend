"use client";

import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { Glyph, type GlyphName } from "@/components/design/Glyph";
import { cn } from "@/lib/utils";
import type { PathNode } from "@/types/pathfinder";

const iconMap: Record<PathNode["type"], GlyphName> = {
  goal: "target",
  career: "ascend",
  skill: "skill",
  quest: "quest",
  proof: "proof",
  grant: "grant",
  portfolio: "portfolio",
  milestone: "milestone",
  competition: "grant",
};

export function CustomGraphNode({ data }: NodeProps) {
  const node = data as unknown as PathNode;
  const icon = iconMap[node.type];
  const locked = node.status === "locked";
  const completed = node.status === "completed";
  const available = node.status === "available";

  return (
    <div
      className={cn(
        "pixel-frame relative min-h-[124px] w-[230px] overflow-hidden border p-4 transition",
        locked && "border-border-soft bg-surface-3 opacity-45 grayscale",
        available && "pixel-border border-warm-white bg-surface-2",
        completed && "pixel-border border-warm-white/70 bg-warm-white text-near-black",
        node.status === "in_progress" && "border-warm-white bg-surface-2",
      )}
    >
      <Handle type="target" position={Position.Left} className="!border-warm-white !bg-near-black" />
      <Handle type="source" position={Position.Right} className="!border-warm-white !bg-near-black" />
      <div className="relative flex items-start justify-between gap-3">
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center border", completed ? "border-near-black/30 bg-near-black text-warm-white" : "border-ember-line bg-surface text-warm-white")}>
          <Glyph name={locked ? "lock" : icon} size="md" />
        </div>
        <span className={cn("pixel-chip px-2 py-1 font-mono text-[10px] uppercase", completed ? "border-near-black/20" : "border-ember-line text-ash-muted")}>
          {node.type}
        </span>
      </div>
      <h3 className="relative mt-4 text-base font-normal lowercase leading-tight tracking-[-0.02em]">{node.title}</h3>
      <p className={cn("mt-2 line-clamp-2 text-xs leading-5", completed ? "text-near-black/70" : "text-ash-muted")}>{node.description}</p>
      <div className="mt-4 flex items-center justify-between font-mono text-[11px]">
        <span>{node.xp} XP</span>
        <span>{node.status.replace("_", " ")}</span>
      </div>
    </div>
  );
}
