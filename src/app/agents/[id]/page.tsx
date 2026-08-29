import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentAvatar } from "@/components/agent-avatar";
import { categorySlug, consumerPrice, consumerTrust, getConsumerCategory } from "@/lib/agents/consumer";
import { normalizeAgent } from "@/lib/agents/normalize";
import { absoluteDate, displayAgentName, short } from "@/lib/format";
import { getBscAgent } from "@/lib/scan8004/client";
import { getVerifiedClaim } from "@/lib/supabase/claims";

export const dynamic = "force-dynamic";

type ServiceView = { name: string; description: string };

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function humanize(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function serviceViews(value: unknown): ServiceView[] {
  if (!value) return [];
  const entries: Array<[string, unknown]> = Array.isArray(value)
    ? value.map((item, index) => [`Service ${index + 1}`, item])
    : typeof value === "object"
      ? Object.entries(value as Record<string, unknown>)
      : [];

  return entries.slice(0, 6).map(([key, item]) => {
    if (typeof item === "string") return { name: humanize(key), description: item.startsWith("http") ? "A callable service published by this agent." : item };
    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      return {
        name: stringValue(record.name) ?? stringValue(record.title) ?? stringValue(record.skill) ?? humanize(key),
        description: stringValue(record.description) ?? stringValue(record.summary) ?? stringValue(record.detail) ?? "A callable service published by this agent.",
      };
    }
    return { name: humanize(key), description: "A service published by this agent." };
  });
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
  const services = serviceViews(agent.services);
  const canHire = id === "265375";
  const txHash = typeof agent.created_tx_hash === "string" ? agent.created_tx_hash : null;
  const similarHref = categorySlug(normalized.derived.category) ? `/agents?category=${categorySlug(normalized.derived.category)}` : "/agents";

  return <main className="container page-content agent-storefront">
    <div className="agent-profile-bento">
    <section className="agent-storefront-hero">
      <div className="agent-storefront-identity"><AgentAvatar imageUrl={agent.image_url} name={displayName} large /><div><span>{categoryName}</span><h1>{displayName}</h1><p>{agent.description || category.promise}</p></div></div>
      <div className="agent-storefront-cta"><small>{canHire ? "Ready when you are" : category.action}</small>{canHire ? <Link className="primary-action" href={`/agents/${id}/hire`}>Start a task</Link> : <Link className="secondary-action" href={similarHref}>Compare agents</Link>}</div>
    </section>

    <section className="agent-proof-strip" aria-label="Agent proof">
      <div><span>Onchain feedback</span><b>{agent.total_feedbacks ? `${agent.average_score}/5` : "No reviews yet"}</b><small>{agent.total_feedbacks ? `${agent.total_feedbacks} recorded` : "Be the first"}</small></div>
      <div><span>Price</span><b>{consumerPrice(agent)}</b><small>Review before paying</small></div>
      <div><span>Delivery</span><b>Not published</b><small>Confirmed with quote</small></div>
      <div><span>Identity</span><b>{agent.is_verified || claim ? "Verified" : "Onchain"}</b><small>Registered on BNB Chain</small></div>
    </section>

    <section className="agent-services-section">
      <div className="storefront-section-heading"><h2>What this agent can do for you</h2><p>Choose a service, review the result and price, then start the task.</p></div>
      {services.length ? <div className="consumer-service-list">{services.map((service, index) => <article key={`${service.name}-${index}`}><div><h3>{service.name}</h3><p>{service.description}</p></div><dl><div><dt>Result</dt><dd>{category.result}</dd></div><div><dt>Price</dt><dd>{consumerPrice(agent)}</dd></div><div><dt>Time</dt><dd>Confirmed with quote</dd></div></dl>{canHire && <Link href={`/agents/${id}/hire`}>Use this service</Link>}</article>)}</div> : <div className="service-empty"><h3>No services published</h3><p>Compare similar agents to find one with a clear service and result.</p><Link href={similarHref}>Find another agent</Link></div>}
    </section>

    <section className="agent-expectations"><div><h2>What comes back</h2><p>{category.result}</p></div><div><h2>What you provide</h2><p>{category.inputs}</p></div><div><h2>Why trust it</h2><p>{consumerTrust(agent)}</p></div></section>

    <section className="agent-reviews-section"><div><h2>{agent.total_feedbacks ? `${agent.total_feedbacks} onchain feedback ${agent.total_feedbacks === 1 ? "entry" : "entries"}` : "No customer reviews yet"}</h2><p>{agent.total_feedbacks ? `Average score: ${agent.average_score}/5` : "This is a new or unreviewed provider."}</p></div><p>{agent.total_feedbacks ? "These entries come from the wider ERC-8004 network. AgentDB has not independently verified that every entry came from a paid job." : "Start small, review the quote, and never grant permissions the task does not need."}</p></section>

    <details className="agent-technical-details"><summary>Onchain identity and technical details <span aria-hidden="true">+</span></summary><div><dl><div><dt>Agent ID</dt><dd>#{agent.token_id}</dd></div><div><dt>Owner</dt><dd><code>{agent.owner_address}</code></dd></div><div><dt>Identity registry</dt><dd><code>{agent.contract_address}</code></dd></div><div><dt>Created</dt><dd>{absoluteDate(agent.created_at)}</dd></div><div><dt>Protocols</dt><dd>{agent.supported_protocols?.join(", ") || "None declared"}</dd></div><div><dt>Registration</dt><dd>{txHash ? <a target="_blank" rel="noreferrer" href={`https://bscscan.com/tx/${txHash}`}>{short(txHash, 14, 10)}</a> : "Unavailable"}</dd></div></dl><Link href={`/agents/${id}/claim`}>Claim this agent</Link><details><summary>View raw record</summary><pre className="raw-record">{JSON.stringify(agent, null, 2)}</pre></details></div></details>
    </div>
  </main>;
}
