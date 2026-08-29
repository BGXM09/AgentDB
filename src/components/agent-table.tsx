import Link from "next/link";
import { normalizeAgent } from "@/lib/agents/normalize";
import { displayAgentName, relativeDate, short } from "@/lib/format";
import type { ScanAgentDetail } from "@/lib/agents/types";
import { StatusBadge } from "./status-badge";
import { AgentAvatar } from "./agent-avatar";

export function AgentTable({ agents, showCategory = true, hideAgentId = false, imageLed = false, marketplace = true }: { agents: ScanAgentDetail[]; showCategory?: boolean; hideAgentId?: boolean; imageLed?: boolean; marketplace?: boolean }) {
  if (!agents.length) return <div className="empty"><b>No agents found.</b><p>No real indexed records matched this view.</p></div>;

  return <div className="agent-card-grid">
    {agents.map((agent) => {
      const normalized = normalizeAgent(agent);
      const category = normalized.derived.category === "Other" ? "General purpose" : normalized.derived.category;
      const displayName = displayAgentName(normalized.canonical.name, agent.token_id);

      return <Link className={`agent-registry-card${imageLed ? " image-led-agent-card" : ""}`} href={`/agents/${agent.token_id}`} key={agent.id}>
        {imageLed && normalized.canonical.imageUrl && <AgentAvatar imageUrl={normalized.canonical.imageUrl} name={displayName} artwork />}
        {!hideAgentId && <div className="agent-card-top"><span className="agent-card-id">#{agent.token_id}</span></div>}
        <div className="agent-card-identity"><AgentAvatar imageUrl={normalized.canonical.imageUrl} name={displayName} /><div><strong>{displayName}</strong><code>{short(agent.owner_address)}</code></div></div>
        <div className="agent-card-facts">
          {showCategory && <div><span>Category</span><b>{category}</b></div>}
          <div><span>Trust score</span><b>{agent.total_score > 0 ? `${agent.total_score}/100` : "Not scored yet"}</b></div>
          <div><span>Reputation</span><b>{agent.total_feedbacks ? `${agent.average_score}/5 · ${agent.total_feedbacks} reviews` : "No reviews yet"}</b></div>
        </div>
        <div className="agent-card-bottom">{marketplace ? <><StatusBadge tone="success">Available</StatusBadge><span>Live hiring detected</span></> : <><StatusBadge>Indexed identity</StatusBadge><span>{relativeDate(agent.updated_at)}</span></>}</div>
        <span className="agent-card-action">{marketplace ? "View and hire" : "Inspect record"}</span>
      </Link>;
    })}
  </div>;
}
