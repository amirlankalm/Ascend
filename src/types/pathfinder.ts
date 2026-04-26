export type NodeType =
  | "goal"
  | "career"
  | "skill"
  | "quest"
  | "proof"
  | "grant"
  | "portfolio"
  | "milestone"
  | "competition";

export type NodeStatus = "locked" | "available" | "in_progress" | "completed";
export type EdgeRelation = "requires" | "unlocks" | "proves" | "improves" | "funds" | "depends_on";
export type QuestStatus = "available" | "in_progress" | "submitted" | "completed";
export type ProofStatus = "pending" | "passed" | "needs_work";

export type ProfileInput = {
  age: number;
  city: string;
  country: string;
  school: string;
  grade: string;
  interests: string[];
  dailyAvailableTime: number;
  confidenceLevel: "beginner" | "intermediate" | "advanced";
  achievements: string;
};

export type GoalInput = {
  goal: string;
  targetRole: string;
  motivation: string;
  constraints: string;
};

export type PathNode = {
  id: string;
  tempId?: string;
  type: NodeType;
  title: string;
  description: string;
  status: NodeStatus;
  x: number;
  y: number;
  difficulty: number;
  xp: number;
  metadata: Record<string, unknown>;
};

export type PathEdge = {
  id: string;
  source: string;
  target: string;
  relation: EdgeRelation;
  weight: number;
  metadata: Record<string, unknown>;
};

export type Quest = {
  id: string;
  nodeId: string;
  title: string;
  whyItMatters: string;
  instructions: string;
  expectedOutput: string;
  timeEstimate: number;
  difficulty: number;
  xpReward: number;
  relatedSkills: string[];
  status: QuestStatus;
  evaluationRubric: string[];
};

export type ProofValidation = {
  validationScore: number;
  authenticityScore: number;
  effortScore: number;
  skillScore: number;
  passed: boolean;
  extractedSkills: string[];
  feedback: string;
  unlockRecommendation: string;
};

export type ProofSubmission = {
  questId: string;
  textProof: string;
  externalUrl?: string;
  filePath?: string;
};

export type PortfolioItem = {
  id: string;
  proofId: string;
  title: string;
  summary: string;
  cvBullet: string;
  longDescription: string;
  skills: string[];
  tags: string[];
  polishScore: number;
  impactScore: number;
};

export type Opportunity = {
  id: string;
  title: string;
  provider: string;
  countryRegion: string;
  eligibility: string;
  deadline: string;
  amount: string;
  tags: string[];
  url: string;
};

export type OpportunityMatch = {
  id: string;
  opportunity: Opportunity;
  matchScore: number;
  reason: string;
  missingRequirements: string[];
  nextAction: string;
};

export type ProgressGraph = {
  nodes: PathNode[];
  edges: PathEdge[];
  quests: Quest[];
  summary: string;
};

export type PathfinderState = {
  profile: ProfileInput;
  goal: GoalInput;
  graph: ProgressGraph;
  proofs: Array<ProofSubmission & { id: string; validation: ProofValidation }>;
  portfolio: PortfolioItem[];
  opportunities: OpportunityMatch[];
  xp: number;
};
