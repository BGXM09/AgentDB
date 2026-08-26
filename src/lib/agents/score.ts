import type { ScanAgentDetail } from "./types";

export type ScoreResult = {
  score: number | null;
  confidence: "High" | "Medium" | "Low" | "Insufficient history";
  evidence: Array<{ label: string; value: string; weight: string }>;
};

export function calculateAgentDbScore(agent: ScanAgentDetail): ScoreResult {
  const feedbacks = agent.total_feedbacks ?? 0;
  const validations = typeof agent.total_validations === "number" ? agent.total_validations : 0;
  const completedAgentDbJobs = 0;
  const evidence = [
    { label: "Execution", value: "No verified AgentDB jobs", weight: "40%" },
    { label: "Reputation", value: feedbacks ? `${feedbacks} ERC-8004 feedback item${feedbacks === 1 ? "" : "s"}` : "No ERC-8004 feedback", weight: "25%" },
    { label: "Reliability", value: agent.health_score == null ? "No endpoint health evidence" : `Indexed endpoint health ${agent.health_score}/100`, weight: "20%" },
    { label: "Identity & Transparency", value: `${agent.is_verified ? "Verified" : "Registered"} ERC-8004 identity`, weight: "15%" },
  ];

  if (completedAgentDbJobs === 0 && feedbacks < 3 && validations < 3) {
    return { score: null, confidence: "Insufficient history", evidence };
  }

  const reputation = Math.max(0, Math.min(100, agent.average_score ?? 0));
  const reliability = Math.max(0, Math.min(100, agent.health_score ?? 0));
  const identity = agent.is_verified ? 100 : agent.services ? 65 : 35;
  const score = Math.round(reputation * 0.25 + reliability * 0.2 + identity * 0.15);
  return { score, confidence: validations + feedbacks >= 10 ? "Medium" : "Low", evidence };
}
