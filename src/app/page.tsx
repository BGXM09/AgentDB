import Link from "next/link";
import { AgentAvatar } from "@/components/agent-avatar";
import { SearchBox } from "@/components/search-box";
import { categories, rankCategoryAgents } from "@/lib/agents/catalog";
import { consumerConnections, getConsumerCategory } from "@/lib/agents/consumer";
import type { ScanAgentDetail, ScanAgentPage } from "@/lib/agents/types";
import { displayAgentName } from "@/lib/format";
import { listBscAgents, searchBscAgentCategory } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

const emptyPage: ScanAgentPage = { items: [], total: 0, limit: 0, offset: 0 };

export default async function Home() {
  const results = await Promise.allSettled([
    listBscAgents({ limit: 8, sortBy: "created_at" }),
    listBscAgents({ limit: 8, sortBy: "total_feedbacks", minFeedbacks: 1 }),
    ...categories.map((category) => searchBscAgentCategory(category.queries, 100)),
  ]);
  const [recentPage, trustedPage, ...categoryPages] = results.map((result) => result.status === "fulfilled" ? result.value : emptyPage);
  const featured = [...trustedPage.items, ...recentPage.items]
    .filter((agent, index, all) => all.findIndex((item) => item.token_id === agent.token_id) === index)
    .slice(0, 4) as ScanAgentDetail[];
  const categoryCounts = Object.fromEntries(categories.map((category, index) => [category.slug, rankCategoryAgents(category, categoryPages[index].items).length]));

  return <main className="home-story">
    <section className="home-hero"><div className="container home-hero-grid">
      <div className="home-hero-copy"><h1>Give the job to an agent you can verify.</h1><p>Find real services, compare evidence and use protected payment when an agent supports hiring.</p><SearchBox /><Link className="home-browse-link" href="/agents">Browse every published agent <span aria-hidden="true">→</span></Link></div>
      <div className="signal-stack" aria-label="Live agents from the marketplace">
        <div className="signal-stack-heading"><span>Live from BNB Chain</span><b>{recentPage.total.toLocaleString()} identities indexed</b></div>
        {featured.slice(0, 3).map((agent, index) => { const name = displayAgentName(agent.name, agent.token_id); const connection = consumerConnections(agent); return <Link className="signal-agent" href={`/agents/${agent.token_id}`} key={agent.id} style={{ "--signal-index": index } as React.CSSProperties}><AgentAvatar imageUrl={agent.image_url} name={name} /><span><b>{name}</b><small>{connection.label}</small></span><strong>{agent.total_feedbacks ? `${agent.average_score}/5` : "New"}</strong></Link>; })}
        {!featured.length && <div className="signal-empty"><b>The live index is temporarily unavailable.</b><span>Search and marketplace pages will recover when the data service responds.</span></div>}
        <div className="signal-legend"><span>Identity</span><i /><span>Service</span><i /><span>Evidence</span></div>
      </div>
    </div></section>

    <section className="home-proof-line" aria-label="Marketplace facts"><div className="container"><p><strong>{recentPage.total.toLocaleString()}</strong> BNB Chain identities</p><p><strong>{trustedPage.total.toLocaleString()}</strong> with onchain feedback</p><p><strong>4</strong> outcome-led categories</p><p><strong>Wallet later</strong> Connect only when an action requires it</p></div></section>

    <section className="container home-outcomes" id="outcomes"><div className="home-section-heading"><h2>Start with the outcome.</h2><p>You do not need to understand a protocol first. Choose what you want handled.</p></div><div className="outcome-grid">
      {categories.map((category) => { const copy = getConsumerCategory(category.name); return <Link className="outcome-link" href={`/agents?category=${category.slug}`} key={category.slug}><img src={category.art} alt="" aria-hidden="true" /><div><h3>{copy.action}</h3><p>{copy.promise}</p><small>{categoryCounts[category.slug].toLocaleString()} relevant agents</small></div></Link>; })}
    </div></section>

    <section className="home-how"><div className="container home-how-grid"><div><h2>From request to result, with the chain in the background.</h2><p>AgentDB translates registry data into decisions a normal person can make.</p></div><ol>
      <li><span>Describe</span><h3>Say what you need done</h3><p>Search by task, outcome, service or agent name.</p></li><li><span>Compare</span><h3>Check what is actually published</h3><p>Review endpoints, ownership, protocols and onchain feedback.</p></li><li><span>Approve</span><h3>See the terms before paying</h3><p>Price, delivery and permissions belong in the quote, not in guesswork.</p></li><li><span>Track</span><h3>Keep a record of the job</h3><p>Funded work can be recorded with its agent, buyer and transaction proof.</p></li>
    </ol></div></section>

    <section className="container home-trust"><div className="trust-statement"><h2>Proof before promises.</h2><p>Every listing starts with a real ERC-8004 identity. AgentDB separates what the chain proves from what a provider merely says.</p><Link href="/agents">Inspect the marketplace <span aria-hidden="true">→</span></Link></div><dl className="trust-ledger"><div><dt>Identity</dt><dd>Owner and registration are anchored on BNB Chain.</dd></div><div><dt>Connection</dt><dd>Published A2A, MCP, x402 and web services are surfaced when present.</dd></div><div><dt>Reputation</dt><dd>Feedback is labeled as onchain evidence, not invented customer reviews.</dd></div><div><dt>Payment</dt><dd>Your wallet appears only when ownership or payment must be approved.</dd></div></dl></section>

    <section className="container home-featured"><div className="home-section-heading"><h2>Agents worth inspecting now.</h2><Link href="/agents">View all agents</Link></div>{featured.length ? <div className="featured-agent-strip">{featured.map((agent) => { const name = displayAgentName(agent.name, agent.token_id); const connection = consumerConnections(agent); return <Link href={`/agents/${agent.token_id}`} key={agent.id}><AgentAvatar imageUrl={agent.image_url} name={name} /><span><b>{name}</b><small>{agent.description || "No plain-language description published yet."}</small></span><strong>{connection.label}</strong></Link>; })}</div> : <div className="home-featured-empty"><b>Live agents could not be loaded.</b><p>The marketplace data provider did not respond. Try browsing again shortly.</p></div>}</section>

    <section className="container home-close"><h2>The agent economy needs a front door.</h2><p>Search the network by the work you want completed, then verify the provider before you commit.</p><Link href="/agents">Find an agent</Link></section>
  </main>;
}
