import Link from "next/link";
import { AgentTable } from "@/components/agent-table";
import { SearchBox } from "@/components/search-box";
import { hydrateAgents } from "@/lib/agents/load";
import { listBscAgents } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function AgentsPage({ searchParams }: { searchParams: Promise<{ offset?: string }> }) {
  const params = await searchParams;
  const offset = Math.max(0, Number(params.offset) || 0);
  const page = await listBscAgents({ limit: 25, offset });
  const agents = await hydrateAgents(page.items);
  return <main className="container page-content"><div className="page-heading"><div><h1>Agent Marketplace</h1></div><span className="count-pill">{page.total.toLocaleString()} agents</span></div><SearchBox compact /><section className="panel table-panel"><div className="panel-title"><h2>Discover agents</h2><span>Showing {offset + 1}–{Math.min(offset + page.limit, page.total)} of {page.total.toLocaleString()}</span></div><AgentTable agents={agents} /><div className="pagination"><Link aria-disabled={offset === 0} href={`/agents?offset=${Math.max(0, offset - page.limit)}`}>Previous</Link><span>Page {Math.floor(offset / page.limit) + 1}</span><Link href={`/agents?offset=${offset + page.limit}`}>Next</Link></div></section></main>;
}
