import { NextResponse } from "next/server";
import { matchOpportunityReason } from "@/lib/ai/path-engine";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { persistOpportunityMatches } from "@/lib/supabase/persistence";
import type { PathfinderState } from "@/types/pathfinder";

export async function POST(request: Request) {
  const { state } = (await request.json()) as { state: PathfinderState };
  const matches = await matchOpportunityReason(state);
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await persistOpportunityMatches(supabase, data.user.id, matches);
    }
  }
  return NextResponse.json({ matches });
}
