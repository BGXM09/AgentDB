import Link from "next/link";
import { normalizeAgent } from "@/lib/agents/normalize";
import { getBscAgent, listBscAgents, searchBscAgents } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function AgentsInspector({ searchParams }: { searchParams: Promise<{ q?: string; offset?: string }> }) {
  const input = await searchParams;
  const query = input.q?.trim() ?? "";
  const offset = Math.max(Number(input.offset) || 0, 0);
  const page = query ? await searchBscAgents(query) : await listBscAgents({ offset });
  const details = await Promise.allSettled(page.items.map((agent) => getBscAgent(agent.token_id)));
  const agents = page.items.map((summary, index) => {
    const result = details[index];
    const raw = result.status === "fulfilled" ? result.value : summary;
    return { raw, normalized: normalizeAgent(raw) };
  });
  const previous = Math.max(offset - page.limit, 0);
  const next = offset + page.limit;
  return <main className="container page-content">
    <div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Internal<span>/</span>Agents</div>
    <div className="page-heading"><div><h1>Agent Data Inspector</h1><p>Canonical 8004scan records beside conservative AgentDB derivations.</p></div><span className="count-pill">Internal · BSC Mainnet</span></div>
    <form className="universal-search compact"><input name="q" defaultValue={query} placeholder="Search real BSC agents by intent, name, ID or capability"/><button>Search</button></form>
    <div className="notice info-notice"><b>{page.total.toLocaleString()} matching indexed records.</b> This development-only route shows untrusted external metadata as escaped text.</div>
    <div className="panel table-panel"><div className="table-scroll"><table className="explorer-table"><thead><tr><th>Agent</th><th>Owner</th><th>Protocols</th><th>Category detection</th><th>Commerce</th><th>Feedback</th><th>Raw</th></tr></thead><tbody>
      {agents.map(({ raw, normalized }) => <tr key={raw.id}><td><strong>{normalized.canonical.name}</strong><small>#{raw.token_id}</small></td><td><code>{raw.owner_address.slice(0, 8)}…{raw.owner_address.slice(-6)}</code></td><td>{raw.supported_protocols?.join(", ") || "—"}</td><td><span className={`badge ${normalized.derived.categoryConfidence}`}>{normalized.derived.category}</span><small>{normalized.derived.categoryConfidence} confidence</small></td><td>{normalized.derived.commerce}</td><td>{raw.total_feedbacks || "—"}</td><td><details><summary>Inspect</summary><pre>{JSON.stringify({ canonical: raw, agentdb: normalized.derived }, null, 2)}</pre></details></td></tr>)}
    </tbody></table></div></div>
    {!query && <nav className="pagination"><Link aria-disabled={offset === 0} href={`?offset=${previous}`}>Previous</Link><span>{offset + 1}–{Math.min(next, page.total)}</span><Link href={`?offset=${next}`}>Next</Link></nav>}
  </main>;
}
