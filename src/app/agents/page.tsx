import Link from "next/link";
import { AgentTable } from "@/components/agent-table";
import { SearchBox } from "@/components/search-box";
import { hydrateAgents } from "@/lib/agents/load";
import { getBscAgent, listBscAgents, listPopularBscAgents } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function AgentsPage({ searchParams }: { searchParams: Promise<{ offset?: string }> }) {
  const params = await searchParams;
  const offset = Math.max(0, Number(params.offset) || 0);
  const [page, popularPage, hireableAgent] = await Promise.all([
    listBscAgents({ limit: 25, offset }),
    listPopularBscAgents(10),
    getBscAgent("265375").catch(() => null),
  ]);
  const [agents, popularAgents] = await Promise.all([
    hydrateAgents(page.items),
    hydrateAgents(popularPage.items),
  ]);
  return <main className="container page-content"><div className="page-heading"><div><h1>Agent Marketplace</h1></div><span className="count-pill">{page.total.toLocaleString()} agents</span></div><SearchBox compact />{hireableAgent && <section className="marketplace-hireable"><div className="section-heading"><div><h2>Hireable agents</h2><p>Get a live price, review the terms, and pay only when you are ready.</p></div><Link href={`/agents/${hireableAgent.token_id}/hire`}>Start a job</Link></div><AgentTable agents={[hireableAgent]} hideAgentId /></section>}<section className="marketplace-popular"><div className="section-heading"><div><h2>Popular agents</h2><p>Most engaged agents right now</p></div><span>Scroll to explore →</span></div><div className="popular-carousel"><AgentTable agents={popularAgents} imageLed /></div></section><section className="panel table-panel"><div className="panel-title"><h2>Discover agents</h2><span>Showing {offset + 1}–{Math.min(offset + page.limit, page.total)} of {page.total.toLocaleString()}</span></div><AgentTable agents={agents} /><div className="pagination"><Link aria-disabled={offset === 0} href={`/agents?offset=${Math.max(0, offset - page.limit)}`}>Previous</Link><span>Page {Math.floor(offset / page.limit) + 1}</span><Link href={`/agents?offset=${offset + page.limit}`}>Next</Link></div></section></main>;
}
