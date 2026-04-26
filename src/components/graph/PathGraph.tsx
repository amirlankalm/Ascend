"use client";

import { useCallback, useMemo, useState } from "react";
import { Background, Controls, MarkerType, ReactFlow, type Edge, type Node } from "@xyflow/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Glyph } from "@/components/design/Glyph";
import { CustomGraphNode } from "@/components/graph/CustomGraphNode";
import type { PathNode, ProgressGraph } from "@/types/pathfinder";

const nodeTypes = { pathNode: CustomGraphNode };

export function PathGraph({ graph }: { graph: ProgressGraph }) {
  const [selected, setSelected] = useState<PathNode | null>(null);
  const nodes = useMemo<Node[]>(
    () =>
      graph.nodes.map((node) => ({
        id: node.id,
        type: "pathNode",
        position: { x: node.x, y: node.y },
        data: node,
      })),
    [graph.nodes],
  );

  const edges = useMemo<Edge[]>(
    () =>
      graph.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#EDEDED" },
        style: {
          stroke: edge.relation === "funds" ? "#F5F5F5" : "#A1A1AA",
          strokeWidth: edge.weight > 0.9 ? 2.2 : 1.5,
          opacity: 0.84,
        },
        className: "path-edge",
      })),
    [graph.edges],
  );

  const onNodeClick = useCallback((_event: unknown, node: Node) => {
    setSelected(node.data as unknown as PathNode);
  }, []);

  return (
    <section className="relative h-[calc(100vh-80px)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        minZoom={0.35}
        maxZoom={1.25}
        onNodeClick={onNodeClick}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="rgba(161,161,170,0.16)" gap={48} />
        <Controls className="!border !border-ember-line !bg-surface !text-warm-white" />
      </ReactFlow>
      {selected && (
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="terrain-panel pixel-frame pixel-border absolute right-5 top-5 z-20 w-[min(420px,calc(100vw-40px))] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-sun-orange">{selected.type}</p>
              <h2 className="mt-2 text-2xl font-normal lowercase tracking-[-0.02em]">{selected.title}</h2>
            </div>
            <button className="pixel-frame border border-ember-line p-2 text-warm-white transition hover:bg-warm-white hover:text-near-black" onClick={() => setSelected(null)} aria-label="Close node detail">
              <Glyph name="close" size="sm" />
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-ash-muted">{selected.description}</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Metric label="Status" value={selected.status.replace("_", " ")} />
            <Metric label="Difficulty" value={`${selected.difficulty}/5`} />
            <Metric label="XP" value={`${selected.xp}`} />
          </div>
          <div className="mt-4 grid gap-2 border-t border-ember-line pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sun-orange">Engine readout</p>
            <p className="text-sm leading-6 text-ash-muted">
              {selected.status === "locked"
                ? "Locked until upstream proof is validated. Finish an available mission to open this route."
                : selected.status === "completed"
                  ? "Completed signal. Ascend can use this as evidence for portfolio and opportunity matching."
                  : "Available now. This is the next high-leverage move in the graph."}
            </p>
          </div>
          {selected.type === "quest" && selected.status !== "locked" && (
            <a href={`/dashboard/quest/${selected.id}`} className="mt-5 block">
              <Button className="w-full">
                <Glyph name="quest" size="sm" />
                Open mission
              </Button>
            </a>
          )}
        </motion.aside>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="pixel-frame border border-ember-line bg-surface-3 p-3">
      <p className="font-mono text-[10px] uppercase text-ash-muted">{label}</p>
      <p className="mt-1 text-sm font-normal text-warm-white">{value}</p>
    </div>
  );
}
