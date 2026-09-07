import Link from "next/link";
import { formatUnits } from "viem";
import { listMarketplaceTasks } from "@/lib/supabase/tasks";
import { short } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await listMarketplaceTasks();
  return <main className="container page-content"><div className="page-heading"><div><h1>Jobs</h1><p>Work funded through verified ERC-8183 escrow.</p></div><span className="count-pill">{tasks.length} verified</span></div><section className="panel table-panel"><div className="panel-title"><h2>Marketplace jobs</h2></div>{tasks.length ? <div className="table-scroll"><table className="explorer-table"><thead><tr><th>Job</th><th>Agent</th><th>Buyer</th><th>Budget</th><th>Status</th><th>Transaction</th></tr></thead><tbody>{tasks.map((task) => <tr key={task.id}><td>#{task.job_id}</td><td><Link href={`/agents/${task.agent_id}`}>Agent #{task.agent_id}</Link></td><td><code>{short(task.client_address)}</code></td><td>{formatUnits(BigInt(task.budget), 18)} $U</td><td>{task.status}</td><td>{task.transaction_hash ? <a href={`https://bscscan.com/tx/${task.transaction_hash}`} target="_blank" rel="noreferrer">View on BscScan</a> : "Relay confirmed"}</td></tr>)}</tbody></table></div> : <div className="empty"><span className="empty-symbol">J</span><b>No funded jobs yet</b><p>Completed quote review and verified ERC-8183 funding will appear here.</p></div>}</section></main>;
}
