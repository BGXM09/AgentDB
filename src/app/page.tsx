import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { StatusBadge } from "@/components/status-badge";
import { auditedAgentIds, categories } from "@/lib/agents/catalog";
import { hydrateAgents } from "@/lib/agents/load";
import { relativeDate, short } from "@/lib/format";
import { listBscAgents } from "@/lib/scan8004/client";
import { BackgroundShapes } from "@/components/ui/background-shapes";
import { ExplorerIcon } from "@/components/explorer-icon";
import { StatsBento } from "@/components/ui/stats-bento";

export const dynamic = "force-dynamic";

export default async function Home() {
  const page = await listBscAgents({ limit: 10 });
  const agents = await hydrateAgents(page.items, 8);
  return <main>
    <section className="hero-band"><BackgroundShapes className="hero-shapes" colors={["white"]}/><div className="container"><h1>Find your next onchain agent.</h1><SearchBox /></div></section>
    <div className="container overlap">
      <StatsBento indexedAgents={page.total} categoryCount={categories.length} auditedProfiles={auditedAgentIds.length} />
      <section className="category-strip"><div className="section-heading"><div><h2>Explore Agent Categories</h2><p>Browse real agents by their indexed metadata and capabilities.</p></div><Link href="/agents">View all agents</Link></div><div className="category-grid">{categories.map((category) => <Link href={`/categories/${category.slug}`} className="category-tile" key={category.slug}><span className="category-glyph"><ExplorerIcon type="agent" /></span><span><b>{category.name}</b><small>{category.description}</small></span><ExplorerIcon type="arrow" /></Link>)}</div></section>
      <section className="split-panels">
        <div className="panel"><div className="panel-title"><h2>Latest Agents</h2><Link href="/agents">View all agents</Link></div><div className="feed-list">{agents.slice(0, 6).map((agent) => <div className="feed-row" key={agent.id}><span className="feed-icon"><ExplorerIcon type="agent" /></span><div><Link href={`/agents/${agent.token_id}`}><b>{agent.name}</b></Link><small>Agent #{agent.token_id}</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><code>{short(agent.owner_address)}</code></div></div>)}</div><Link className="panel-footer" href="/agents">View all agents <ExplorerIcon type="arrow" /></Link></div>
        <div className="panel"><div className="panel-title"><h2>Latest Tasks / Activity</h2><Link href="/activity">View activity</Link></div><div className="feed-list">{agents.slice(0, 5).map((agent) => <div className="feed-row" key={agent.id}><span className="feed-icon tx"><ExplorerIcon type="activity" /></span><div><Link href={`/agents/${agent.token_id}`}><b>Agent #{agent.token_id} registered</b></Link><small>Confirmed ERC-8004 registration</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><StatusBadge tone="info">Registration</StatusBadge></div></div>)}<div className="feed-row empty-row"><span className="feed-icon tx"><ExplorerIcon type="task" /></span><div><b>No verified task data available</b><small>Task activity appears only after a verified mediated job.</small></div></div></div><Link className="panel-footer" href="/tasks">Open Task Explorer <ExplorerIcon type="arrow" /></Link></div>
      </section>
    </div>
  </main>;
}
