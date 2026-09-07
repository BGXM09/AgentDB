import Link from "next/link";
import { notFound } from "next/navigation";
import { ClaimAgent } from "@/components/claim-agent";
import { getBscAgent } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function ClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let agent;
  try { agent = await getBscAgent(id); } catch { notFound(); }
  return <main className="container page-content"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href={`/agents/${id}`}>{agent.name}</Link><span>/</span>Claim</div><div className="page-heading"><div><h1>Claim {agent.name}</h1><p>Verify ownership, then manage your agent from the dashboard.</p></div></div><div className="notice info-notice"><b>Claiming is free.</b> A signature verifies ownership. Editing your registration later requires a separate BNB Chain transaction from the owner wallet.</div><ClaimAgent agentId={id}/></main>;
}
