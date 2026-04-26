"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Glyph } from "@/components/design/Glyph";
import { PathGraph } from "@/components/graph/PathGraph";
import { loadSecureState, resetState } from "@/lib/demo/storage";
import type { PathfinderState } from "@/types/pathfinder";

export default function GraphDashboardPage() {
  const [state, setState] = useState<PathfinderState | null>(null);

  useEffect(() => {
    window.setTimeout(() => {
      void loadSecureState().then(setState);
    }, 0);
  }, []);

  if (!state) return <div className="px-5 py-10 text-ash-muted">Loading graph...</div>;
  const completed = state.graph.nodes.filter((node) => node.status === "completed").length;
  const available = state.graph.nodes.filter((node) => node.status === "available").length;
  const locked = state.graph.nodes.filter((node) => node.status === "locked").length;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-5 top-5 z-20 max-w-sm md:left-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ash-muted">Path Engine / graph runtime</p>
        <h1 className="mt-1 text-3xl font-normal lowercase leading-none tracking-[-0.02em] md:text-5xl">{state.goal.targetRole}</h1>
        <div className="pointer-events-auto mt-4 flex gap-3 font-mono text-[11px] text-ash-muted">
          <span className="flex items-center gap-1"><span className="text-warm-white">{completed}</span> done</span>
          <span className="text-ember-line">·</span>
          <span className="flex items-center gap-1"><span className="text-warm-white">{available}</span> open</span>
          <span className="text-ember-line">·</span>
          <span className="flex items-center gap-1"><span className="text-warm-white">{locked}</span> locked</span>
        </div>
      </div>
      <div className="pointer-events-auto absolute bottom-24 left-5 z-20 flex gap-3 md:bottom-5 md:left-8">
        <Button variant="ghost" onClick={() => setState(resetState())}>
          <Glyph name="scan" size="sm" />
          Reset demo
        </Button>
      </div>
      <PathGraph graph={state.graph} />
    </div>
  );
}
