import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { StatusBadge } from "@/components/status-badge";
import { categories } from "@/lib/agents/catalog";
import { hydrateAgents } from "@/lib/agents/load";
import { relativeDate, short } from "@/lib/format";
import { listBscAgents } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const page = await listBscAgents({ limit: 10 });
  const agents = await hydrateAgents(page.items, 8);
  return <main>
    <section className="hero-band"><div className="container"><p className="eyebrow">The BNB Agent Economy Explorer</p><h1>Explore BNB Smart Chain Agents</h1><SearchBox /><p className="hero-help">Discover real ERC-8004 identities. Wallet connection is not required.</p></div></section>
    <div className="container overlap">
      <section className="stats-card">
        <div><span className="metric-icon">A</span><p>INDEXED BSC AGENTS<b>{page.total.toLocaleString()}</b></p></div>
        <div><span className="metric-icon">✓</span><p>VERIFIED HIRES<b>Not available</b></p></div>
        <div><span className="metric-icon">T</span><p>AGENTDB TASKS<b>0</b></p></div>
        <div><span className="metric-icon">56</span><p>NETWORK<b>BNB Mainnet</b></p></div>
      </section>
      <section className="category-strip"><div className="section-heading"><div><h2>Explore Agent Categories</h2><p>Mandatory hackathon categories, classified from real metadata.</p></div></div><div className="category-grid">{categories.map((category, index) => <Link href={`/categories/${category.slug}`} className="category-tile" key={category.slug}><span className="category-number">0{index + 1}</span><b>{category.name}</b><small>{category.description}</small><span className="arrow">View agents →</span></Link>)}</div></section>
      <section className="split-panels">
        <div className="panel"><div className="panel-title"><h2>Latest Agents</h2><Link href="/agents">View all agents</Link></div><div className="feed-list">{agents.slice(0, 6).map((agent) => <div className="feed-row" key={agent.id}><span className="feed-icon">A</span><div><Link href={`/agents/${agent.token_id}`}><b>{agent.name}</b></Link><small>Agent #{agent.token_id}</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><code>{short(agent.owner_address)}</code></div></div>)}</div><Link className="panel-footer" href="/agents">View all agents →</Link></div>
        <div className="panel"><div className="panel-title"><h2>Latest Tasks / Activity</h2><Link href="/activity">View activity</Link></div><div className="feed-list">{agents.slice(0, 5).map((agent) => <div className="feed-row" key={agent.id}><span className="feed-icon tx">R</span><div><Link href={`/agents/${agent.token_id}`}><b>Agent #{agent.token_id} registered</b></Link><small>Confirmed ERC-8004 registration</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><StatusBadge tone="info">Registration</StatusBadge></div></div>)}<div className="feed-row empty-row"><span className="feed-icon tx">T</span><div><b>No AgentDB tasks yet</b><small>Task activity appears only after a verified mediated job.</small></div></div></div><Link className="panel-footer" href="/tasks">Open Task Explorer →</Link></div>
      </section>
    </div>
  </main>;
}
