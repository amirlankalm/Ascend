import { NextResponse } from "next/server";
import { generatePortfolioItem, validateProof } from "@/lib/ai/path-engine";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { persistProofResult } from "@/lib/supabase/persistence";
import type { PathfinderState } from "@/types/pathfinder";

export async function POST(request: Request) {
  const { state, questId, textProof, externalUrl } = (await request.json()) as {
    state: PathfinderState;
    questId: string;
    textProof: string;
    externalUrl?: string;
  };
  const quest = state.graph.quests.find((item) => item.id === questId) ?? state.graph.quests[0];
  const proof = { questId, textProof, externalUrl };
  const validation = await validateProof(quest, proof, state.graph);
  const portfolio = await generatePortfolioItem(proof, quest, state.profile, validation);

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await persistProofResult(supabase, data.user.id, state, quest, proof, validation, portfolio);
    }
  }

  return NextResponse.json({ validation, portfolio });
}
