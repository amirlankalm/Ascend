import { createInitialState } from "@/lib/demo/graph";
import { matchOpportunityReason } from "@/lib/ai/path-engine";
import { unlockGraphAfterProof } from "@/lib/graph/unlock";
import type { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  GoalInput,
  OpportunityMatch,
  PathfinderState,
  PortfolioItem,
  ProfileInput,
  ProgressGraph,
  ProofSubmission,
  ProofValidation,
  Quest,
} from "@/types/pathfinder";

type SupabaseClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

export async function persistGeneratedPath(
  supabase: SupabaseClient,
  userId: string,
  profile: ProfileInput,
  goal: GoalInput,
  graph: ProgressGraph,
) {
  await supabase.from("profiles").upsert({
    id: userId,
    age: profile.age,
    city: profile.city,
    country: profile.country,
    school: profile.school,
    grade: profile.grade,
    interests: profile.interests,
    daily_available_time: profile.dailyAvailableTime,
    confidence_level: profile.confidenceLevel,
    onboarding_completed: true,
  });

  const { data: goalRow, error: goalError } = await supabase
    .from("goals")
    .insert({
      user_id: userId,
      user_goal: goal.goal,
      target_role: goal.targetRole,
      motivation: goal.motivation,
      constraints: goal.constraints,
      status: "active",
    })
    .select("id")
    .single();

  if (goalError || !goalRow) throw goalError ?? new Error("Goal insert failed");

  const { data: nodeRows, error: nodeError } = await supabase
    .from("graph_nodes")
    .insert(
      graph.nodes.map((node) => ({
        user_id: userId,
        goal_id: goalRow.id,
        temp_id: node.id,
        type: node.type,
        title: node.title,
        description: node.description,
        status: node.status,
        x: node.x,
        y: node.y,
        difficulty: node.difficulty,
        xp: node.xp,
        metadata: node.metadata,
      })),
    )
    .select("id,temp_id");

  if (nodeError || !nodeRows) throw nodeError ?? new Error("Graph node insert failed");
  const idByTemp = new Map(nodeRows.map((row) => [row.temp_id, row.id]));

  const edgeRows = graph.edges
    .map((edge) => ({
      user_id: userId,
      goal_id: goalRow.id,
      source_node_id: idByTemp.get(edge.source),
      target_node_id: idByTemp.get(edge.target),
      relation: edge.relation,
      weight: edge.weight,
      metadata: { ...edge.metadata, temp_id: edge.id, source_temp_id: edge.source, target_temp_id: edge.target },
    }))
    .filter((row) => row.source_node_id && row.target_node_id);

  if (edgeRows.length) {
    const { error } = await supabase.from("graph_edges").insert(edgeRows);
    if (error) throw error;
  }

  const questRows = graph.quests.map((quest) => ({
    user_id: userId,
    goal_id: goalRow.id,
    graph_node_id: idByTemp.get(quest.nodeId) ?? null,
    temp_id: quest.id,
    title: quest.title,
    instructions: quest.instructions,
    expected_output: quest.expectedOutput,
    time_estimate: quest.timeEstimate,
    difficulty: quest.difficulty,
    xp_reward: quest.xpReward,
    status: quest.status,
    evaluation_rubric: {
      why_it_matters: quest.whyItMatters,
      related_skills: quest.relatedSkills,
      items: quest.evaluationRubric,
    },
  }));

  if (questRows.length) {
    const { error } = await supabase.from("quests").insert(questRows);
    if (error) throw error;
  }

  await supabase.from("activity_log").insert({
    user_id: userId,
    event_type: "path.generated",
    message: `Generated Path Engine graph for ${goal.targetRole}.`,
    metadata: { goal_id: goalRow.id, nodes: graph.nodes.length, edges: graph.edges.length },
  });
}

export async function persistProofResult(
  supabase: SupabaseClient,
  userId: string,
  state: PathfinderState,
  quest: Quest,
  proof: ProofSubmission,
  validation: ProofValidation,
  portfolio: PortfolioItem,
) {
  const { data: questRow } = await supabase
    .from("quests")
    .select("id,goal_id,graph_node_id")
    .eq("user_id", userId)
    .eq("temp_id", quest.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!questRow) return;

  const { data: proofRow, error: proofError } = await supabase
    .from("proofs")
    .insert({
      user_id: userId,
      quest_id: questRow.id,
      text_proof: proof.textProof,
      external_url: proof.externalUrl ?? null,
      file_proof_path: proof.filePath ?? null,
      ai_validation_scores: {
        validation: validation.validationScore,
        authenticity: validation.authenticityScore,
        effort: validation.effortScore,
        skill: validation.skillScore,
      },
      extracted_skills: validation.extractedSkills,
      feedback: validation.feedback,
      status: validation.passed ? "passed" : "needs_work",
    })
    .select("id")
    .single();

  if (proofError || !proofRow) throw proofError ?? new Error("Proof insert failed");

  await supabase
    .from("quests")
    .update({ status: validation.passed ? "completed" : "submitted" })
    .eq("id", questRow.id)
    .eq("user_id", userId);

  if (validation.passed) {
    await supabase.from("portfolio_items").insert({
      user_id: userId,
      proof_id: proofRow.id,
      title: portfolio.title,
      summary: portfolio.summary,
      cv_bullet: portfolio.cvBullet,
      long_description: portfolio.longDescription,
      skills: portfolio.skills,
      tags: portfolio.tags,
      polish_score: portfolio.polishScore,
      impact_score: portfolio.impactScore,
    });

    const unlocked = unlockGraphAfterProof(state.graph, quest.nodeId, validation);
    await Promise.all(
      unlocked.nodes.map((node) =>
        supabase
          .from("graph_nodes")
          .update({ status: node.status })
          .eq("user_id", userId)
          .eq("goal_id", questRow.goal_id)
          .eq("temp_id", node.id),
      ),
    );
  }

  await supabase.from("activity_log").insert({
    user_id: userId,
    event_type: validation.passed ? "proof.passed" : "proof.needs_work",
    message: validation.passed ? `Validated proof for ${quest.title}.` : `Proof needs more work for ${quest.title}.`,
    metadata: { quest_id: questRow.id, proof_id: proofRow.id, scores: validation },
  });
}

export async function persistOpportunityMatches(
  supabase: SupabaseClient,
  userId: string,
  matches: OpportunityMatch[],
) {
  const { data: grants } = await supabase.from("grants").select("id,title");
  const grantByTitle = new Map((grants ?? []).map((grant) => [grant.title, grant.id]));
  const rows = matches
    .map((match) => ({
      user_id: userId,
      grant_id: grantByTitle.get(match.opportunity.title),
      match_score: match.matchScore,
      reason: match.reason,
      missing_requirements: match.missingRequirements,
      next_action: match.nextAction,
    }))
    .filter((row) => row.grant_id);

  if (rows.length) {
    await supabase.from("grant_matches").upsert(rows, { onConflict: "user_id,grant_id" });
  }
}

export async function loadPersistedState(supabase: SupabaseClient, userId: string): Promise<PathfinderState | null> {
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!profile || !goal) return null;

  const [{ data: nodes }, { data: edges }, { data: quests }, { data: portfolioRows }, { data: proofRows }] = await Promise.all([
    supabase.from("graph_nodes").select("*").eq("user_id", userId).eq("goal_id", goal.id),
    supabase.from("graph_edges").select("*, source:source_node_id(temp_id), target:target_node_id(temp_id)").eq("user_id", userId).eq("goal_id", goal.id),
    supabase.from("quests").select("*").eq("user_id", userId).eq("goal_id", goal.id),
    supabase.from("portfolio_items").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("proofs").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);

  const state = createInitialState(
    {
      age: profile.age,
      city: profile.city,
      country: profile.country,
      school: profile.school,
      grade: profile.grade,
      interests: profile.interests,
      dailyAvailableTime: profile.daily_available_time,
      confidenceLevel: profile.confidence_level,
      achievements: "",
    },
    {
      goal: goal.user_goal,
      targetRole: goal.target_role,
      motivation: goal.motivation,
      constraints: goal.constraints,
    },
  );

  if (nodes?.length) {
    state.graph.nodes = nodes.map((node) => ({
      id: node.temp_id ?? node.id,
      type: node.type,
      title: node.title,
      description: node.description,
      status: node.status,
      x: node.x,
      y: node.y,
      difficulty: node.difficulty,
      xp: node.xp,
      metadata: node.metadata,
    }));
  }

  if (edges?.length) {
    state.graph.edges = edges.map((edge) => ({
      id: edge.metadata?.temp_id ?? edge.id,
      source: edge.source?.temp_id ?? edge.metadata?.source_temp_id,
      target: edge.target?.temp_id ?? edge.metadata?.target_temp_id,
      relation: edge.relation,
      weight: edge.weight,
      metadata: edge.metadata,
    }));
  }

  if (quests?.length) {
    state.graph.quests = quests.map((questRow) => ({
      id: questRow.temp_id ?? questRow.id,
      nodeId: state.graph.nodes.find((node) => node.id === questRow.temp_id)?.id ?? questRow.temp_id ?? questRow.id,
      title: questRow.title,
      whyItMatters: questRow.evaluation_rubric?.why_it_matters ?? "This mission creates proof for your graph.",
      instructions: questRow.instructions,
      expectedOutput: questRow.expected_output,
      timeEstimate: questRow.time_estimate,
      difficulty: questRow.difficulty,
      xpReward: questRow.xp_reward,
      relatedSkills: questRow.evaluation_rubric?.related_skills ?? [],
      status: questRow.status,
      evaluationRubric: questRow.evaluation_rubric?.items ?? [],
    }));
  }

  state.portfolio =
    portfolioRows?.map((item) => ({
      id: item.id,
      proofId: item.proof_id,
      title: item.title,
      summary: item.summary,
      cvBullet: item.cv_bullet,
      longDescription: item.long_description,
      skills: item.skills,
      tags: item.tags,
      polishScore: item.polish_score,
      impactScore: item.impact_score,
    })) ?? [];

  state.proofs =
    proofRows?.map((proof) => ({
      id: proof.id,
      questId: proof.quest_id,
      textProof: proof.text_proof ?? "",
      externalUrl: proof.external_url ?? undefined,
      filePath: proof.file_proof_path ?? undefined,
      validation: {
        validationScore: proof.ai_validation_scores?.validation ?? 0,
        authenticityScore: proof.ai_validation_scores?.authenticity ?? 0,
        effortScore: proof.ai_validation_scores?.effort ?? 0,
        skillScore: proof.ai_validation_scores?.skill ?? 0,
        passed: proof.status === "passed",
        extractedSkills: proof.extracted_skills,
        feedback: proof.feedback,
        unlockRecommendation: "",
      },
    })) ?? [];

  state.opportunities = await matchOpportunityReason(state);
  return state;
}
