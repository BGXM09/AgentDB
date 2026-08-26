import Link from "next/link";
import { notFound } from "next/navigation";
import { HireFlow } from "@/components/hire-flow";
import { getBscAgent } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function HirePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== "265375") notFound();
  const agent = await getBscAgent(id);
  return <main className="container page-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href={`/agents/${id}`}>{agent.name}</Link><span>/</span>Hire</div><div className="page-heading"><div><h1>Hire {agent.name}</h1><p>Request and review real ERC-8183 job terms before signing or funding.</p></div></div><div className="notice success-notice"><b>Audited ERC-8183 candidate.</b> The A2A card exposes signed quote negotiation and funded-job notification. No successful AgentDB hire has been verified yet.</div><HireFlow agentId={id} agentName={agent.name}/></main>;
}
