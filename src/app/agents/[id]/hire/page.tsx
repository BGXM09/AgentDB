import Link from "next/link";
import { notFound } from "next/navigation";
import { HireFlow } from "@/components/hire-flow";
import { getBscAgent } from "@/lib/scan8004/client";

export const dynamic = "force-dynamic";

export default async function HirePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== "265375") notFound();
  const agent = await getBscAgent(id);
  return <main className="container page-content hire-page"><div className="breadcrumb"><Link href="/agents">Agents</Link><span>/</span><Link href={`/agents/${id}`}>{agent.name}</Link><span>/</span>Start a task</div><div className="page-heading"><div><h1>What do you need done?</h1><p>Describe the result you want. You will see the price and delivery time before you pay.</p></div></div><HireFlow agentId={id} agentName={agent.name}/></main>;
}
