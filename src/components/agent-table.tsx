import Link from "next/link";
import { normalizeAgent } from "@/lib/agents/normalize";
import { calculateAgentDbScore } from "@/lib/agents/score";
import { auditedStatus } from "@/lib/agents/catalog";
import { displayAgentName, relativeDate, short } from "@/lib/format";
import type { ScanAgentDetail } from "@/lib/agents/types";
import { StatusBadge } from "./status-badge";
import { AgentAvatar } from "./agent-avatar";

export function AgentTable({ agents, showCategory = true, hideAgentId = false, imageLed = false }: { agents: ScanAgentDetail[]; showCategory?: boolean; hideAgentId?: boolean; imageLed?: boolean }) {
  if (!agents.length) return <div className="empty"><b>No agents found.</b><p>No real indexed records matched this view.</p></div>;

  return <div className="agent-card-grid">
    {agents.map((agent) => {
      const normalized = normalizeAgent(agent);
      const score = calculateAgentDbScore(agent);
      const audit = auditedStatus[agent.token_id];
      const category = normalized.derived.category === "Other" ? "Unclassified" : normalized.derived.category;
      const displayName = displayAgentName(normalized.canonical.name, agent.token_id);

      return <Link className={`agent-registry-card${imageLed ? " image-led-agent-card" : ""}`} href={`/agents/${agent.token_id}`} key={agent.id}>
        {imageLed && normalized.canonical.imageUrl && <AgentAvatar imageUrl={normalized.canonical.imageUrl} name={displayName} artwork />}
        <div className="agent-card-top">{!hideAgentId && <span className="agent-card-id">#{agent.token_id}</span>}<span className="agent-card-arrow" aria-hidden="true">↗</span></div>
        <div className="agent-card-identity"><AgentAvatar imageUrl={normalized.canonical.imageUrl} name={displayName} /><div><strong>{displayName}</strong><code>{short(agent.owner_address)}</code></div></div>
        <div className="agent-card-facts">
          {showCategory && <div><span>Category</span><b>{category}</b></div>}
          <div><span>Trust signal</span><b>{score.score}/100 · {score.confidence}</b></div>
          <div><span>Reputation</span><b>{agent.total_feedbacks ? `${agent.average_score} · ${agent.total_feedbacks}` : "No history"}</b></div>
        </div>
        <div className="agent-card-bottom">{audit ? <StatusBadge tone={audit.tone}>{audit.label}</StatusBadge> : <StatusBadge>Not verified</StatusBadge>}<span>{relativeDate(agent.updated_at)}</span></div>
      </Link>;
    })}
  </div>;
}
