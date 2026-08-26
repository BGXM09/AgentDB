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
  return <main className="container page-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Agents</div><div className="page-heading"><div><h1>Agent Registry</h1><p>Real ERC-8004 identities indexed on BNB Smart Chain.</p></div><span className="count-pill">{page.total.toLocaleString()} indexed</span></div><SearchBox compact /><div className="notice info-notice"><b>Registered does not mean hireable.</b> AgentDB verifies services, endpoint health and commerce support separately.</div><section className="panel table-panel"><div className="panel-title"><h2>Agents</h2><span>Showing {offset + 1}–{Math.min(offset + page.limit, page.total)} of {page.total.toLocaleString()}</span></div><AgentTable agents={agents} /><div className="pagination"><Link aria-disabled={offset === 0} href={`/agents?offset=${Math.max(0, offset - page.limit)}`}>Previous</Link><span>Page {Math.floor(offset / page.limit) + 1}</span><Link href={`/agents?offset=${offset + page.limit}`}>Next</Link></div></section></main>;
}
