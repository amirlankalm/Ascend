"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EngineStrip } from "@/components/design/EngineStrip";
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
      <div className="pointer-events-none absolute left-5 top-5 z-20 max-w-2xl md:left-8">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-warm-white">Path Engine / graph runtime</p>
        <h1 className="mt-2 text-4xl font-normal lowercase leading-none tracking-[-0.02em] md:text-7xl">{state.goal.targetRole}</h1>
        <p className="mt-3 hidden max-w-lg text-sm leading-6 text-ash-muted md:block">{state.graph.summary}</p>
        <div className="pointer-events-auto mt-5 hidden max-w-2xl md:block">
          <EngineStrip
            items={[
              { icon: "check", label: "Completed", value: `${completed} validated graph signals` },
              { icon: "quest", label: "Available", value: `${available} actions ready today` },
              { icon: "lock", label: "Locked", value: `${locked} future nodes waiting on proof` },
            ]}
          />
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
