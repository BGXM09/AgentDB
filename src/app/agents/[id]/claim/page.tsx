import Link from "next/link";
import { notFound } from "next/navigation";
import { ClaimAgent } from "@/components/claim-agent";
import { getBscAgent } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function ClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let agent;
  try { agent = await getBscAgent(id); } catch { notFound(); }
  return <main className="container page-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href={`/agents/${id}`}>{agent.name}</Link><span>/</span>Claim</div><div className="page-heading"><div><h1>Claim {agent.name}</h1><p>Verify the current ERC-8004 owner before editing AgentDB enrichment.</p></div></div><div className="notice info-notice"><b>Canonical fields remain read-only.</b> Claiming never overwrites identity, owner, registration, reputation, or service metadata indexed from ERC-8004.</div><ClaimAgent agentId={id}/></main>;
}
