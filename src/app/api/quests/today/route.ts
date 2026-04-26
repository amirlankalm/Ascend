import { NextResponse } from "next/server";
import type { PathfinderState } from "@/types/pathfinder";

export async function POST(request: Request) {
  const { state } = (await request.json()) as { state: PathfinderState };
  const quest =
    state.graph.quests.find((item) => item.status === "available") ??
    state.graph.quests.find((item) => item.status === "in_progress") ??
    state.graph.quests[0];
  return NextResponse.json({ quest });
}
