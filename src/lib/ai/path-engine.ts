import { z } from "zod";
import { createDemoGraph } from "@/lib/demo/graph";
import { seedOpportunities } from "@/lib/demo/opportunities";
import { fallbackPortfolioItem, fallbackValidateProof } from "@/lib/ai/fallbacks";
import { getOpenAI } from "@/lib/ai/client";
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

const GraphSchema = z.object({
  summary: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["goal", "career", "skill", "quest", "proof", "grant", "portfolio", "milestone", "competition"]),
      title: z.string(),
      description: z.string(),
      status: z.enum(["locked", "available", "in_progress", "completed"]),
      x: z.number(),
      y: z.number(),
      difficulty: z.number().min(1).max(5),
      xp: z.number(),
      metadata: z.record(z.string(), z.unknown()).default({}),
    }),
  ),
  edges: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
      relation: z.enum(["requires", "unlocks", "proves", "improves", "funds", "depends_on"]),
      weight: z.number(),
      metadata: z.record(z.string(), z.unknown()).default({}),
    }),
  ),
  quests: z.array(
    z.object({
      id: z.string(),
      nodeId: z.string(),
      title: z.string(),
      whyItMatters: z.string(),
      instructions: z.string(),
      expectedOutput: z.string(),
      timeEstimate: z.number(),
      difficulty: z.number(),
      xpReward: z.number(),
      relatedSkills: z.array(z.string()),
      status: z.enum(["available", "in_progress", "submitted", "completed"]),
      evaluationRubric: z.array(z.string()),
    }),
  ),
});

const ValidationSchema = z.object({
  validationScore: z.number(),
  authenticityScore: z.number(),
  effortScore: z.number(),
  skillScore: z.number(),
  passed: z.boolean(),
  extractedSkills: z.array(z.string()),
  feedback: z.string(),
  unlockRecommendation: z.string(),
});

const PortfolioSchema = z.object({
  title: z.string(),
  summary: z.string(),
  cvBullet: z.string(),
  longDescription: z.string(),
  skills: z.array(z.string()),
  tags: z.array(z.string()),
  polishScore: z.number(),
  impactScore: z.number(),
});

export async function generateProgressGraph(profile: ProfileInput, goal: GoalInput): Promise<ProgressGraph> {
  const client = getOpenAI();
  if (!client) return createDemoGraph(profile, goal);

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are Path Engine, an execution graph generator for high school students. Return concrete proof-driven quests, not vague advice. Every quest must be doable today, age-appropriate, context-aware, and tied to graph unlocks.",
        },
        {
          role: "user",
          content: JSON.stringify({ profile, goal, requiredDemoQuality: "Goal -> graph -> quest -> proof -> portfolio -> opportunity" }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "progress_graph",
          schema: z.toJSONSchema(GraphSchema),
          strict: true,
        },
      },
    });
    const parsed = GraphSchema.parse(JSON.parse(response.output_text));
    return parsed;
  } catch (error) {
    console.error("AI graph generation failed, using fallback", error);
    return createDemoGraph(profile, goal);
  }
}

export async function validateProof(quest: Quest, proof: ProofSubmission, graphContext: ProgressGraph): Promise<ProofValidation> {
  const client = getOpenAI();
  if (!client) return fallbackValidateProof(quest, proof);

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "Validate student proof supportively but honestly. Do not reward vague text. Score concrete evidence, fit to rubric, effort, and demonstrated skills. Never exaggerate achievement.",
        },
        { role: "user", content: JSON.stringify({ quest, proof, graphContext }) },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "proof_validation",
          schema: z.toJSONSchema(ValidationSchema),
          strict: true,
        },
      },
    });
    return ValidationSchema.parse(JSON.parse(response.output_text));
  } catch (error) {
    console.error("AI proof validation failed, using fallback", error);
    return fallbackValidateProof(quest, proof);
  }
}

export async function generatePortfolioItem(
  proof: ProofSubmission,
  quest: Quest,
  profile: ProfileInput,
  validation: ProofValidation,
): Promise<PortfolioItem> {
  const client = getOpenAI();
  if (!client) return fallbackPortfolioItem(quest, proof, validation);

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "Convert validated student proof into polished portfolio material. Be impressive but truthful. Do not invent outcomes, metrics, or affiliations.",
        },
        { role: "user", content: JSON.stringify({ proof, quest, profile, validation }) },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "portfolio_item",
          schema: z.toJSONSchema(PortfolioSchema),
          strict: true,
        },
      },
    });
    const item = PortfolioSchema.parse(JSON.parse(response.output_text));
    return { ...item, id: `portfolio_${Date.now()}`, proofId: proof.questId };
  } catch (error) {
    console.error("AI portfolio generation failed, using fallback", error);
    return fallbackPortfolioItem(quest, proof, validation);
  }
}

export async function matchOpportunityReason(state: PathfinderState): Promise<OpportunityMatch[]> {
  const lower = JSON.stringify({
    goal: state.goal,
    profile: state.profile,
    portfolio: state.portfolio,
    skills: state.proofs.flatMap((proof) => proof.validation.extractedSkills),
  }).toLowerCase();

  return seedOpportunities
    .map((opportunity) => {
      const tagScore = opportunity.tags.reduce((score, tag) => score + (lower.includes(tag.toLowerCase()) ? 9 : 0), 0);
      const countryScore = lower.includes(opportunity.countryRegion.toLowerCase()) || opportunity.countryRegion.includes("Online") ? 10 : 0;
      const portfolioScore = state.portfolio.length ? 16 : 0;
      const matchScore = Math.min(96, 58 + tagScore + countryScore + portfolioScore);
      return {
        id: `match_${opportunity.id}`,
        opportunity,
        matchScore,
        reason:
          matchScore > 80
            ? "Strong match: your current graph evidence already points toward this opportunity."
            : "Emerging match: this fits your goal, but Ascend sees a few proof gaps before applying.",
        missingRequirements:
          state.portfolio.length > 0 ? ["Application essay draft", "One recommendation or mentor note"] : ["Validated proof artifact", "CV-ready project bullet"],
        nextAction:
          state.portfolio.length > 0
            ? "Reuse your generated portfolio item as the application project evidence."
            : "Complete today’s quest and generate a portfolio item first.",
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}
