import type { ScanAgentDetail } from "./types";

export type ScoreResult = {
  score: number;
  confidence: "High" | "Medium" | "Low" | "Insufficient history";
  evidence: Array<{ label: string; value: string; weight: string }>;
};

export function calculateAgentDbScore(agent: ScanAgentDetail): ScoreResult {
  const feedbacks = agent.total_feedbacks ?? 0;
  const validations = typeof agent.total_validations === "number" ? agent.total_validations : 0;
  const evidence = [
    { label: "Execution", value: "No verified AgentDB jobs", weight: "40%" },
    { label: "Reputation", value: feedbacks ? `${feedbacks} ERC-8004 feedback item${feedbacks === 1 ? "" : "s"}` : "No ERC-8004 feedback", weight: "25%" },
    { label: "Reliability", value: agent.health_score == null ? "No endpoint health evidence" : `Indexed endpoint health ${agent.health_score}/100`, weight: "20%" },
    { label: "Identity & Transparency", value: `${agent.is_verified ? "Verified" : "Registered"} ERC-8004 identity`, weight: "15%" },
  ];

  const signals: Array<{ value: number; weight: number }> = [];
  if (feedbacks > 0) signals.push({ value: Math.max(0, Math.min(100, agent.average_score ?? 0)), weight: 25 });
  if (agent.health_score != null) signals.push({ value: Math.max(0, Math.min(100, agent.health_score)), weight: 20 });
  signals.push({ value: agent.is_verified ? 85 : agent.services ? 65 : 40, weight: 15 });
  const totalWeight = signals.reduce((sum, signal) => sum + signal.weight, 0);
  const score = Math.round(signals.reduce((sum, signal) => sum + signal.value * signal.weight, 0) / totalWeight);
  return { score, confidence: validations + feedbacks >= 10 ? "Medium" : "Low", evidence };
}
