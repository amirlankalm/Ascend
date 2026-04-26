import type { PathEdge, PathNode, ProofValidation, ProgressGraph } from "@/types/pathfinder";

export function unlockGraphAfterProof(graph: ProgressGraph, questNodeId: string, validation: ProofValidation): ProgressGraph {
  if (!validation.passed) return graph;

  const completed = new Set<string>([questNodeId]);
  const nodes = graph.nodes.map((node) =>
    node.id === questNodeId ? { ...node, status: "completed" as const } : node,
  );

  const directUnlocks = graph.edges
    .filter((edge) => edge.source === questNodeId || edge.relation === "proves")
    .filter((edge) => edge.source === questNodeId)
    .map((edge) => edge.target);

  directUnlocks.forEach((id) => completed.add(id));

  const updated = nodes.map((node) => {
    if (directUnlocks.includes(node.id)) {
      return { ...node, status: node.type === "proof" ? ("completed" as const) : ("available" as const) };
    }
    return node;
  });

  const resolved = updated.map((node) => {
    if (node.status !== "locked") return node;
    return requirementsComplete(node, graph.edges, updated) ? { ...node, status: "available" as const } : node;
  });

  return {
    ...graph,
    nodes: resolved,
    quests: graph.quests.map((quest) =>
      quest.nodeId === questNodeId ? { ...quest, status: "completed" as const } : quest,
    ),
  };
}

function requirementsComplete(node: PathNode, edges: PathEdge[], nodes: PathNode[]) {
  const requiredSources = edges
    .filter((edge) => edge.target === node.id && ["requires", "depends_on", "unlocks", "proves"].includes(edge.relation))
    .map((edge) => edge.source);

  if (requiredSources.length === 0) return false;
  return requiredSources.every((source) => nodes.find((candidate) => candidate.id === source)?.status === "completed");
}
