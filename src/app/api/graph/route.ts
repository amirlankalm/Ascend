import { NextResponse } from "next/server";
import { generateProgressGraph } from "@/lib/ai/path-engine";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { persistGeneratedPath } from "@/lib/supabase/persistence";
import type { GoalInput, PathfinderState, ProfileInput } from "@/types/pathfinder";

export async function POST(request: Request) {
  const { profile, goal } = (await request.json()) as { profile: ProfileInput; goal: GoalInput };
  const graph = await generateProgressGraph(profile, goal);
  const state: PathfinderState = { profile, goal, graph, proofs: [], portfolio: [], opportunities: [], xp: 0 };

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await persistGeneratedPath(supabase, data.user.id, profile, goal, graph);
    }
  }

  return NextResponse.json(state);
}
