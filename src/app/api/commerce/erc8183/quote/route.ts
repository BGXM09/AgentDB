import { NextResponse } from "next/server";
import { ERC8183CommerceAdapter } from "@/lib/commerce/erc8183";

export async function POST(request: Request) {
  try {
    const input = await request.json() as { agentId?: string; taskDescription?: string; deliverables?: string; qualityStandards?: string };
    if (!input.agentId || !input.taskDescription?.trim() || !input.deliverables?.trim() || !input.qualityStandards?.trim()) return NextResponse.json({ error: "Task, deliverables, and quality standards are required." }, { status: 400 });
    if ([input.taskDescription, input.deliverables, input.qualityStandards].some((value) => (value?.length ?? 0) > 1200)) return NextResponse.json({ error: "Quote input is too long." }, { status: 400 });
    const quote = await new ERC8183CommerceAdapter().getQuote({ agentId: input.agentId, taskDescription: input.taskDescription.trim(), deliverables: input.deliverables.trim(), qualityStandards: input.qualityStandards.trim() });
    return NextResponse.json(quote);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Quote request failed." }, { status: 502 }); }
}
