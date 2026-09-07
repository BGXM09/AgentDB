import Link from "next/link";
import { notFound } from "next/navigation";
import { ClaimAgent } from "@/components/claim-agent";
import { getBscAgent, Scan8004Error } from "@/lib/scan8004/client";
import { displayAgentName } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const agent = await getBscAgent(id).catch((error: unknown) => { if (error instanceof Scan8004Error && error.status === 404) notFound(); throw error; });
  const name = displayAgentName(agent.name, id);
  return <main className="container page-content owner-page"><div className="breadcrumb"><Link href={`/agents/${id}`}>{name}</Link><span>/</span>Manage agent</div><div className="page-heading"><div><h1>Your agent. Ready to connect.</h1><p>Claim {name}, then publish the endpoint people can use to work with it.</p></div></div><ClaimAgent agentId={id} registry={agent.contract_address}/></main>;
}
