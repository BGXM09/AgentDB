import Link from "next/link";
import { normalizeAgent } from "@/lib/agents/normalize";
import { calculateAgentDbScore } from "@/lib/agents/score";
import { auditedStatus } from "@/lib/agents/catalog";
import { relativeDate, short } from "@/lib/format";
import type { ScanAgentDetail } from "@/lib/agents/types";
import { StatusBadge } from "./status-badge";

export function AgentTable({ agents, showCategory = true }: { agents: ScanAgentDetail[]; showCategory?: boolean }) {
  if (!agents.length) return <div className="empty"><b>No agents found.</b><p>No real indexed records matched this view.</p></div>;
  return <div className="table-scroll"><table className="explorer-table"><thead><tr><th>ID</th><th>Agent</th>{showCategory && <th>Category</th>}<th>AgentDB Score</th><th>Reputation</th><th>Hireability</th><th>Last Updated</th></tr></thead><tbody>
    {agents.map((agent) => {
      const normalized = normalizeAgent(agent);
      const score = calculateAgentDbScore(agent);
      const audit = auditedStatus[agent.token_id];
      return <tr key={agent.id}><td><Link href={`/agents/${agent.token_id}`}>#{agent.token_id}</Link></td><td><div className="agent-cell"><span className="agent-icon">A</span><span><Link href={`/agents/${agent.token_id}`}><b>{normalized.canonical.name}</b></Link><small><code>{short(agent.owner_address)}</code></small></span></div></td>{showCategory && <td>{normalized.derived.category === "Other" ? "—" : normalized.derived.category}<small>{normalized.derived.category !== "Other" ? `${normalized.derived.categoryConfidence} confidence` : "Unclassified"}</small></td>}<td>{score.score == null ? <span className="subtle">Insufficient history</span> : <b>{score.score}/100</b>}<small>{score.confidence}</small></td><td>{agent.total_feedbacks ? `${agent.average_score} (${agent.total_feedbacks})` : "—"}</td><td>{audit ? <StatusBadge tone={audit.tone}>{audit.label}</StatusBadge> : <StatusBadge>Not verified</StatusBadge>}</td><td>{relativeDate(agent.updated_at)}<small>{agent.supported_protocols?.join(", ") || "No protocol declared"}</small></td></tr>;
    })}
  </tbody></table></div>;
}
