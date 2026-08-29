import Link from "next/link";
import { AgentAvatar } from "@/components/agent-avatar";
import { consumerPrice, consumerTrust } from "@/lib/agents/consumer";
import { normalizeAgent } from "@/lib/agents/normalize";
import { displayAgentName } from "@/lib/format";
import type { ScanAgentDetail } from "@/lib/agents/types";

export function MarketplaceAgentList({ agents }: { agents: ScanAgentDetail[] }) {
  if (!agents.length) return <div className="marketplace-empty"><h2>No matching agents</h2><p>Try another category or search for a different job.</p><Link href="/agents">Browse all agents</Link></div>;

  return <div className="marketplace-agent-list">
    {agents.map((agent) => {
      const normalized = normalizeAgent(agent);
      const name = displayAgentName(normalized.canonical.name, agent.token_id);
      const category = normalized.derived.category === "Other" ? "General purpose" : normalized.derived.category;
      return <article className="marketplace-agent-row" key={agent.id}>
        <div className="marketplace-agent-main">
          <AgentAvatar imageUrl={normalized.canonical.imageUrl} name={name} />
          <div><span className="marketplace-agent-category">{category}</span><h2>{name}</h2><p>{normalized.canonical.description || "This provider has not added a plain-language service description yet."}</p></div>
        </div>
        <dl className="marketplace-agent-answers">
          <div><dt>Price</dt><dd>{consumerPrice(agent)}</dd></div>
          <div><dt>Delivery</dt><dd>Not listed</dd></div>
          <div><dt>Proof</dt><dd>{consumerTrust(agent)}</dd></div>
        </dl>
        <div className="marketplace-agent-action"><Link href={`/agents/${agent.token_id}`}><span>Open profile</span><b>Agent {agent.token_id}</b></Link></div>
      </article>;
    })}
  </div>;
}
