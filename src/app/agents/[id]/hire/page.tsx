import Link from "next/link";
import { notFound } from "next/navigation";
import { HireFlow } from "@/components/hire-flow";
import { getBscAgent } from "@/lib/scan8004/client";
import { isStudioHireable } from "@/lib/agents/marketplace";

export const dynamic = "force-dynamic";

export default async function HirePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await getBscAgent(id);
  if (!isStudioHireable(agent)) notFound();
  return <main className="container page-content hire-page"><div className="breadcrumb"><Link href="/agents">Marketplace</Link><span>/</span><Link href={`/agents/${id}`}>{agent.name}</Link><span>/</span>Start</div><div className="page-heading"><div><h1>Hire {agent.name}</h1><p>Describe the job first. Connect your wallet only after you approve the price.</p></div></div><HireFlow agentId={id} agentName={agent.name}/></main>;
}
