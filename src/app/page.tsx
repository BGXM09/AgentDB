import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { StatusBadge } from "@/components/status-badge";
import { displayAgentName, relativeDate, short } from "@/lib/format";
import type { ScanAgentDetail } from "@/lib/agents/types";
import { listBscAgents, searchBscAgentCategory } from "@/lib/scan8004/client";
import { BackgroundShapes } from "@/components/ui/background-shapes";
import { ExplorerIcon } from "@/components/explorer-icon";
import { StatsBento } from "@/components/ui/stats-bento";
import { AgentAvatar } from "@/components/agent-avatar";
import { categories, rankCategoryAgents } from "@/lib/agents/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [page, ...categoryPages] = await Promise.all([
    listBscAgents({ limit: 10, sortBy: "created_at" }),
    ...categories.map((category) => searchBscAgentCategory(category.queries, 100, category.auditedIds)),
  ]);
  const agents = page.items as ScanAgentDetail[];
  const categoryCounts = Object.fromEntries(categories.map((category, index) => [category.slug, rankCategoryAgents(category, categoryPages[index].items).length]));
  return <main>
    <section className="hero-band"><BackgroundShapes className="hero-shapes" colors={["white"]}/><div className="container"><h1>Find your next onchain agent.</h1><SearchBox /></div></section>
    <div className="container overlap">
      <StatsBento indexedAgents={page.total} categoryCounts={categoryCounts} />
      <section className="split-panels">
        <div className="panel"><div className="panel-title"><h2>Latest Agents</h2></div><div className="feed-list">{agents.slice(0, 6).map((agent) => { const name = displayAgentName(agent.name, agent.token_id); return <div className="feed-row" key={agent.id}><AgentAvatar imageUrl={agent.image_url} name={name} /><div><Link href={`/agents/${agent.token_id}`}><b>{name}</b></Link><small>Agent #{agent.token_id}</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><code>{short(agent.owner_address)}</code></div></div>; })}</div><Link className="panel-footer" href="/agents">View all agents <ExplorerIcon type="arrow" /></Link></div>
        <div className="panel"><div className="panel-title"><h2>Latest Tasks / Activity</h2></div><div className="feed-list">{agents.slice(0, 5).map((agent) => <div className="feed-row" key={agent.id}><span className="feed-icon tx"><ExplorerIcon type="activity" /></span><div><Link href={`/agents/${agent.token_id}`}><b>Agent #{agent.token_id} registered</b></Link><small>Confirmed ERC-8004 registration</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><StatusBadge tone="info">Registration</StatusBadge></div></div>)}<div className="feed-row empty-row"><span className="feed-icon tx"><ExplorerIcon type="task" /></span><div><b>No verified task data available</b><small>Task activity appears only after a verified mediated job.</small></div></div></div><Link className="panel-footer" href="/tasks">Open Task Explorer <ExplorerIcon type="arrow" /></Link></div>
      </section>
    </div>
  </main>;
}
