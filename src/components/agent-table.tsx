import Link from "next/link";
import { normalizeAgent } from "@/lib/agents/normalize";
import { calculateAgentDbScore } from "@/lib/agents/score";
import { auditedStatus } from "@/lib/agents/catalog";
import { relativeDate, short } from "@/lib/format";
import type { ScanAgentDetail } from "@/lib/agents/types";
import { StatusBadge } from "./status-badge";
import { ExplorerIcon } from "./explorer-icon";

export function AgentTable({ agents, showCategory = true }: { agents: ScanAgentDetail[]; showCategory?: boolean }) {
  if (!agents.length) return <div className="empty"><b>No agents found.</b><p>No real indexed records matched this view.</p></div>;

  return <div className="agent-card-grid">
    {agents.map((agent) => {
      const normalized = normalizeAgent(agent);
      const score = calculateAgentDbScore(agent);
      const audit = auditedStatus[agent.token_id];
      const category = normalized.derived.category === "Other" ? "Unclassified" : normalized.derived.category;

      return <Link className="agent-registry-card" href={`/agents/${agent.token_id}`} key={agent.id}>
        <div className="agent-card-top"><span className="agent-card-id">#{agent.token_id}</span><span className="agent-card-arrow" aria-hidden="true">↗</span></div>
        <div className="agent-card-identity"><span className="agent-icon"><ExplorerIcon type="agent" /></span><div><strong>{normalized.canonical.name}</strong><code>{short(agent.owner_address)}</code></div></div>
        <div className="agent-card-facts">
          {showCategory && <div><span>Category</span><b>{category}</b></div>}
          <div><span>AgentDB score</span><b>{score.score == null ? "Pending" : `${score.score}/100`}</b></div>
          <div><span>Reputation</span><b>{agent.total_feedbacks ? `${agent.average_score} · ${agent.total_feedbacks}` : "No history"}</b></div>
        </div>
        <div className="agent-card-bottom">{audit ? <StatusBadge tone={audit.tone}>{audit.label}</StatusBadge> : <StatusBadge>Not verified</StatusBadge>}<span>{relativeDate(agent.updated_at)}</span></div>
      </Link>;
    })}
  </div>;
}
