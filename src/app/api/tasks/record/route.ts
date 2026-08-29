import { NextResponse } from "next/server";
import { BNB, ERC8183_ADDRESSES, getErc8183Job } from "@altananetwork/sdk";
import { isAddress, isHex } from "viem";
import { createServiceSupabase } from "@/lib/supabase/server";

type Input = {
  jobId?: string;
  agentId?: string;
  clientAddress?: string;
  providerAddress?: string;
  budget?: string;
  paymentToken?: string;
  callsId?: string;
  transactionHash?: string;
  taskDescription?: string;
};

export async function POST(request: Request) {
  try {
    const input = await request.json() as Input;
    if (!input.jobId || !/^\d+$/.test(input.jobId) || !input.agentId || !input.clientAddress || !input.providerAddress || !input.budget || !/^\d+$/.test(input.budget) || !input.paymentToken || !input.callsId || !input.taskDescription) return NextResponse.json({ error: "Incomplete task record." }, { status: 400 });
    if (!isAddress(input.clientAddress) || !isAddress(input.providerAddress) || !isAddress(input.paymentToken) || !isHex(input.callsId) || (input.transactionHash && !isHex(input.transactionHash))) return NextResponse.json({ error: "Invalid task record fields." }, { status: 400 });
    if (input.paymentToken.toLowerCase() !== ERC8183_ADDRESSES[56].paymentToken.toLowerCase()) return NextResponse.json({ error: "Unsupported payment token." }, { status: 400 });

    const job = await getErc8183Job(BNB, BigInt(input.jobId));
    if (job.client.toLowerCase() !== input.clientAddress.toLowerCase() || job.provider.toLowerCase() !== input.providerAddress.toLowerCase() || job.budget.toString() !== input.budget || job.description !== input.taskDescription) return NextResponse.json({ error: "Onchain job does not match the submitted task." }, { status: 409 });
    if (job.statusName !== "FUNDED" && job.statusName !== "SUBMITTED" && job.statusName !== "COMPLETED") return NextResponse.json({ error: `Job is ${job.statusName}, not funded.` }, { status: 409 });

    const { error } = await createServiceSupabase().from("marketplace_tasks").upsert({ chain_id: 56, job_id: input.jobId, agent_id: input.agentId, client_address: input.clientAddress.toLowerCase(), provider_address: input.providerAddress.toLowerCase(), budget: input.budget, payment_token: input.paymentToken.toLowerCase(), calls_id: input.callsId, transaction_hash: input.transactionHash ?? null, status: job.statusName, task_description: input.taskDescription, updated_at: new Date().toISOString() }, { onConflict: "chain_id,job_id" });
    if (error) throw error;
    return NextResponse.json({ recorded: true, jobId: input.jobId, status: job.statusName });
  } catch (cause) {
    return NextResponse.json({ error: cause instanceof Error ? cause.message : "Task verification failed." }, { status: 502 });
  }
}
