import { NextResponse } from "next/server";
import { createPublicClient, http, isAddress, isHex } from "viem";
import { bsc } from "viem/chains";
import { commerceAbi, ERC8183_ADDRESSES, JOB_STATUS } from "@/lib/commerce/contracts";
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
    if (!input.jobId || !/^\d+$/.test(input.jobId) || !input.agentId || !input.clientAddress || !input.providerAddress || !input.budget || !/^\d+$/.test(input.budget) || !input.paymentToken || !input.transactionHash || !input.taskDescription) return NextResponse.json({ error: "Incomplete task record." }, { status: 400 });
    if (!isAddress(input.clientAddress) || !isAddress(input.providerAddress) || !isAddress(input.paymentToken) || !isHex(input.transactionHash)) return NextResponse.json({ error: "Invalid task record fields." }, { status: 400 });
    if (input.paymentToken.toLowerCase() !== ERC8183_ADDRESSES[56].paymentToken.toLowerCase()) return NextResponse.json({ error: "Unsupported payment token." }, { status: 400 });

    const client = createPublicClient({ chain: bsc, transport: http(process.env.BSC_MAINNET_RPC_URL) });
    const job = await client.readContract({ address: ERC8183_ADDRESSES[56].commerce, abi: commerceAbi, functionName: "getJob", args: [BigInt(input.jobId)] });
    if (job.client.toLowerCase() !== input.clientAddress.toLowerCase() || job.provider.toLowerCase() !== input.providerAddress.toLowerCase() || job.budget.toString() !== input.budget || job.description !== input.taskDescription) return NextResponse.json({ error: "Onchain job does not match the submitted task." }, { status: 409 });
    const statusName = JOB_STATUS[job.status] ?? "UNKNOWN";
    if (statusName !== "FUNDED" && statusName !== "SUBMITTED" && statusName !== "COMPLETED") return NextResponse.json({ error: `Job is ${statusName}, not funded.` }, { status: 409 });

    const { error } = await createServiceSupabase().from("marketplace_tasks").upsert({ chain_id: 56, job_id: input.jobId, agent_id: input.agentId, client_address: input.clientAddress.toLowerCase(), provider_address: input.providerAddress.toLowerCase(), budget: input.budget, payment_token: input.paymentToken.toLowerCase(), calls_id: input.transactionHash, transaction_hash: input.transactionHash, status: statusName, task_description: input.taskDescription, updated_at: new Date().toISOString() }, { onConflict: "chain_id,job_id" });
    if (error) throw error;
    return NextResponse.json({ recorded: true, jobId: input.jobId, status: statusName });
  } catch (cause) {
    return NextResponse.json({ error: cause instanceof Error ? cause.message : "Task verification failed." }, { status: 502 });
  }
}
