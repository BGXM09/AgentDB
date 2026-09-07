import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentAvatar } from "@/components/agent-avatar";
import { AgentConnections, type AgentEndpoint } from "@/components/agent-connections";
import { consumerPrice, getConsumerCategory } from "@/lib/agents/consumer";
import { normalizeAgent } from "@/lib/agents/normalize";
import { absoluteDate, displayAgentName, short } from "@/lib/format";
import { getBscAgent } from "@/lib/scan8004/client";
import { getVerifiedClaim } from "@/lib/supabase/claims";

export const dynamic = "force-dynamic";

function endpointViews(agent: Record<string, unknown>): AgentEndpoint[] {
  const found = new Map<string, AgentEndpoint>();
  const visit = (value: unknown, trail = "") => {
    if (typeof value === "string" && /^https?:\/\//i.test(value.trim())) {
      const url = value.trim();
      const clue = `${trail} ${url}`.toLowerCase();
      const protocol: AgentEndpoint["protocol"] = clue.includes("x402") ? "x402" : clue.includes("mcp") ? "MCP" : clue.includes("a2a") || clue.includes("agent-card") || clue.includes(".well-known") ? "A2A" : "Service";
      if (!found.has(url)) found.set(url, { protocol, label: protocol === "Service" ? "Published service" : `${protocol} endpoint`, url });
      return;
    }
    if (Array.isArray(value)) value.forEach((item, index) => visit(item, `${trail} ${index}`));
    else if (value && typeof value === "object") Object.entries(value as Record<string, unknown>).forEach(([key, item]) => visit(item, `${trail} ${key}`));
  };
  const metadata = agent.metadata && typeof agent.metadata === "object" ? agent.metadata as Record<string, unknown> : {};
  const rawMetadata = agent.raw_metadata && typeof agent.raw_metadata === "object" ? agent.raw_metadata as Record<string, unknown> : {};
  visit(agent.endpoints, "endpoints");
  visit(agent.services, "services");
  visit(metadata.endpoints, "metadata endpoints");
  visit(metadata.services, "metadata services");
  visit(rawMetadata.endpoints, "raw metadata endpoints");
  visit(rawMetadata.services, "raw metadata services");
  return [...found.values()].slice(0, 8);
}

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let agent;
  try { agent = await getBscAgent(id); } catch { notFound(); }

  const normalized = normalizeAgent(agent);
  const claim = await getVerifiedClaim(id, agent.contract_address);
  const displayName = displayAgentName(agent.name, id);
  const categoryName = normalized.derived.category === "Other" ? "General purpose" : normalized.derived.category;
  const category = getConsumerCategory(normalized.derived.category);
  const endpoints = endpointViews(agent);
  const txHash = typeof agent.created_tx_hash === "string" ? agent.created_tx_hash : null;
  return <main className="container page-content agent-storefront">
    <div className="agent-profile-bento">
    <section className="agent-storefront-hero">
      <div className="agent-storefront-identity"><AgentAvatar imageUrl={agent.image_url} name={displayName} large /><div><span>{categoryName}</span><h1>{displayName}</h1><p>{agent.description || category.promise}</p></div></div>
      <div className="agent-storefront-cta"><small>{endpoints.length ? `${endpoints.length} published ${endpoints.length === 1 ? "endpoint" : "endpoints"}` : "Onchain identity only"}</small><div className="agent-hero-actions"><a className="primary-action" href="#connect">Connect to agent</a><Link className="claim-agent-action" href={`/agents/${id}/claim`}>{claim ? "Manage claim" : "Claim agent"}</Link></div></div>
    </section>

    <section className="agent-proof-strip" aria-label="Agent proof">
      <div><span>Onchain feedback</span><b>{agent.total_feedbacks ? `${agent.average_score}/5` : "No reviews yet"}</b><small>{agent.total_feedbacks ? `${agent.total_feedbacks} recorded` : "Be the first"}</small></div>
      <div><span>Price</span><b>{consumerPrice(agent)}</b><small>Review before paying</small></div>
      <div><span>Delivery</span><b>Not published</b><small>Confirmed with quote</small></div>
      <div><span>Identity</span><b>{agent.is_verified || claim ? "Verified" : "Onchain"}</b><small>Registered on BNB Chain</small></div>
    </section>

    <AgentConnections endpoints={endpoints} />

    <section className="agent-reviews-section"><div><h2>{agent.total_feedbacks ? `${agent.total_feedbacks} onchain feedback ${agent.total_feedbacks === 1 ? "entry" : "entries"}` : "No customer reviews yet"}</h2><p>{agent.total_feedbacks ? `Average score: ${agent.average_score}/5` : "This is a new or unreviewed provider."}</p></div><p>{agent.total_feedbacks ? "These entries come from the wider ERC-8004 network. AgentDB has not independently verified that every entry came from a paid job." : "Start small, review the quote, and never grant permissions the task does not need."}</p></section>

    <details className="agent-technical-details"><summary>Onchain identity and technical details <span aria-hidden="true">+</span></summary><div><dl><div><dt>Agent ID</dt><dd>#{agent.token_id}</dd></div><div><dt>Owner</dt><dd><code>{agent.owner_address}</code></dd></div><div><dt>Identity registry</dt><dd><code>{agent.contract_address}</code></dd></div><div><dt>Created</dt><dd>{absoluteDate(agent.created_at)}</dd></div><div><dt>Protocols</dt><dd>{agent.supported_protocols?.join(", ") || "None declared"}</dd></div><div><dt>Registration</dt><dd>{txHash ? <a target="_blank" rel="noreferrer" href={`https://bscscan.com/tx/${txHash}`}>{short(txHash, 14, 10)}</a> : "Unavailable"}</dd></div></dl><details><summary>View raw record</summary><pre className="raw-record">{JSON.stringify(agent, null, 2)}</pre></details></div></details>
    </div>
  </main>;
}
