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
    ...categories.map((category) => searchBscAgentCategory(category.queries, 100)),
  ]);
  const agents = page.items as ScanAgentDetail[];
  const categoryCounts = Object.fromEntries(categories.map((category, index) => [category.slug, rankCategoryAgents(category, categoryPages[index].items).length]));
  return <main>
    <section className="hero-band"><BackgroundShapes className="hero-shapes" colors={["white"]}/><div className="container"><h1>Find your next onchain agent.</h1><SearchBox /></div></section>
    <div className="container overlap">
      <StatsBento indexedAgents={page.total} categoryCounts={categoryCounts} />
      <section className="split-panels">
        <div className="panel"><div className="panel-title"><h2>Latest Agents</h2></div><div className="feed-list">{agents.slice(0, 6).map((agent) => { const name = displayAgentName(agent.name, agent.token_id); return <div className="feed-row" key={agent.id}><AgentAvatar imageUrl={agent.image_url} name={name} /><div><Link href={`/agents/${agent.token_id}`}><b>{name}</b></Link><small>Agent #{agent.token_id}</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><code>{short(agent.owner_address)}</code></div></div>; })}</div><Link className="panel-footer" href="/agents">View all agents <ExplorerIcon type="arrow" /></Link></div>
        <div className="panel"><div className="panel-title"><h2>Latest Activity</h2></div><div className="feed-list">{agents.slice(0, 5).map((agent) => <div className="feed-row" key={agent.id}><span className="feed-icon tx"><ExplorerIcon type="activity" /></span><div><Link href={`/agents/${agent.token_id}`}><b>Agent #{agent.token_id} registered</b></Link><small>Confirmed ERC-8004 registration</small></div><div className="feed-meta"><span>{relativeDate(agent.created_at)}</span><StatusBadge tone="info">Registration</StatusBadge></div></div>)}<div className="feed-row empty-row"><span className="feed-icon tx"><ExplorerIcon type="task" /></span><div><b>No verified task data available</b><small>Task activity appears only after a verified mediated job.</small></div></div></div><Link className="panel-footer" href="/activity">Explore activity <ExplorerIcon type="arrow" /></Link></div>
      </section>
      <section className="home-guide" aria-labelledby="guide-title">
        <div><h2 id="guide-title">A little context.<br/>A better starting point.</h2><p>Finding an agent is easy. Knowing what to look for makes the next step clearer.</p><Link className="primary-action" href="/agents">Explore the directory <ExplorerIcon type="arrow" /></Link></div>
        <div className="home-guide-rows"><article><h3>Start with the work.</h3><p>Rebalance a portfolio, monitor risk, or explore a trading strategy. Browse a category or search for what you need.</p></article><article><h3>Get to know the agent.</h3><p>Read its description, inspect its published services, and look at its onchain identity and feedback. Registration alone is not a guarantee of quality.</p></article><article><h3>Choose your next step.</h3><p>Check the provider’s requirements and available connections. Confirm what the service does and what it costs before committing.</p></article></div>
      </section>
      <section className="home-owner"><div><h2>You build the agent.<br/>Make its introduction count.</h2><p>Your listing is where people get to know your work. Claim your agent, keep its profile current, and give people a clear way to connect.</p><Link className="primary-action" href="/dashboard">Manage your agents <ExplorerIcon type="arrow" /></Link></div><div className="home-owner-details"><span>In your dashboard</span><p>A name people remember.</p><p>A description that makes sense.</p><p>Services they can actually find.</p><small>Connect the owner wallet to get started.</small></div></section>
      <section className="home-questions"><h2>Before you explore.</h2><div><details><summary>Do I need a wallet to browse?</summary><p>No. Search, browse profiles, and inspect agent information without connecting a wallet. Owners connect when claiming or updating an agent.</p></details><details><summary>What does claiming an agent mean?</summary><p>A claim proves control of its current owner wallet. It gives owners a starting point to manage their listing; it is not an endorsement of the agent’s performance.</p></details><details><summary>How does my agent appear here?</summary><p>AgentDB displays indexed BNB Chain registrations. Find your existing profile, claim it with its owner wallet, then use the dashboard to update its registration.</p></details></div></section>
    </div>
  </main>;
}
