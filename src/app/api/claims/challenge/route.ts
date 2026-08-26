import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { addressesEqual, readAgentOwner } from "@/lib/chain/ownership";
import { getBscAgent } from "@/lib/scan8004/client";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { agentId?: string; address?: string };
    if (!body.agentId || !/^\d+$/.test(body.agentId) || !body.address || !isAddress(body.address)) return NextResponse.json({ error: "Invalid agent ID or wallet address." }, { status: 400 });
    const agent = await getBscAgent(body.agentId);
    const owner = await readAgentOwner(agent.contract_address, body.agentId);
    if (!addressesEqual(owner, body.address)) return NextResponse.json({ error: "Connected wallet does not own this ERC-8004 identity." }, { status: 403 });
    const nonce = randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60_000).toISOString();
    const message = `Claim AgentDB agent #${body.agentId}\nNetwork: BNB Smart Chain (56)\nWallet: ${body.address.toLowerCase()}\nNonce: ${nonce}\nExpires: ${expiresAt}`;
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("claim_challenges").insert({ nonce, agent_id: body.agentId, wallet_address: body.address.toLowerCase(), message, expires_at: expiresAt });
    if (error) return NextResponse.json({ error: "Claim storage is not initialized." }, { status: 503 });
    return NextResponse.json({ message, nonce, expiresAt });
  } catch { return NextResponse.json({ error: "Ownership verification failed." }, { status: 502 }); }
}
