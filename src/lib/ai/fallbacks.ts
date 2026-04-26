import type { PortfolioItem, ProofSubmission, ProofValidation, Quest } from "@/types/pathfinder";
import { clampScore, uid } from "@/lib/utils";

export function fallbackValidateProof(quest: Quest, proof: ProofSubmission): ProofValidation {
  const text = proof.textProof.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const specificSignals = ["problem", "user", "ai", "improve", "startup"].filter((term) =>
    text.toLowerCase().includes(term),
  ).length;
  const validationScore = clampScore(45 + Math.min(30, wordCount / 5) + specificSignals * 6);
  const passed = validationScore >= 70;

  return {
    validationScore,
    authenticityScore: clampScore(62 + Math.min(28, wordCount / 8)),
    effortScore: clampScore(48 + Math.min(40, wordCount / 4)),
    skillScore: clampScore(52 + specificSignals * 9),
    passed,
    extractedSkills: ["market research", "product analysis", "AI literacy"].slice(0, passed ? 3 : 2),
    feedback: passed
      ? "This proof is specific enough to count. It names concrete product criteria and shows early founder judgment. Next time, add one sharper user quote or metric."
      : `This is a useful start, but it needs more concrete evidence for "${quest.title}". Add named examples, the target user, and what you would improve.`,
    unlockRecommendation: passed ? "Unlock Prototype Reflex, Market Scan Proof, and Founder Research Artifact." : "Keep the quest open.",
  };
}

export function fallbackPortfolioItem(quest: Quest, proof: ProofSubmission, validation: ProofValidation): PortfolioItem {
  return {
    id: uid("portfolio"),
    proofId: proof.questId,
    title: "AI Startup Market Analysis",
    summary:
      "Researched early-stage AI products, compared user problems and AI advantages, and identified product improvement opportunities.",
    cvBullet:
      "Analyzed 3 AI startups across user pain, AI advantage, and product gaps; produced a founder-style market brief with local opportunity insight.",
    longDescription:
      "This artifact demonstrates early founder thinking: selecting AI products, explaining target users, identifying where AI changes the workflow, and proposing improvements grounded in observed needs.",
    skills: validation.extractedSkills,
    tags: ["AI", "startups", "market research", "product"],
    polishScore: validation.validationScore,
    impactScore: clampScore(validation.skillScore + 4),
  };
}
