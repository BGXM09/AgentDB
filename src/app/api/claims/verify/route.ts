import { NextResponse } from "next/server";
import { isAddress, verifyMessage } from "viem";
import { addressesEqual, readAgentOwner } from "@/lib/chain/ownership";
import { getBscAgent } from "@/lib/scan8004/client";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { nonce?: string; signature?: string; address?: string };
    if (!body.nonce || !body.signature?.startsWith("0x") || !body.address || !isAddress(body.address)) return NextResponse.json({ error: "Invalid claim proof." }, { status: 400 });
    const supabase = createServiceSupabase();
    const { data: challenge, error } = await supabase.from("claim_challenges").select("nonce,agent_id,wallet_address,message,expires_at,used_at").eq("nonce", body.nonce).maybeSingle();
    if (error || !challenge || challenge.used_at || new Date(challenge.expires_at).getTime() <= Date.now() || !addressesEqual(challenge.wallet_address, body.address)) return NextResponse.json({ error: "Claim challenge is invalid or expired." }, { status: 400 });
    const signatureValid = await verifyMessage({ address: body.address, message: challenge.message, signature: body.signature as `0x${string}` });
    if (!signatureValid) return NextResponse.json({ error: "Wallet signature is invalid." }, { status: 403 });
    const agent = await getBscAgent(challenge.agent_id);
    const owner = await readAgentOwner(agent.contract_address, challenge.agent_id);
    if (!addressesEqual(owner, body.address)) return NextResponse.json({ error: "Wallet no longer owns this ERC-8004 identity." }, { status: 403 });
    const { error: claimError } = await supabase.from("agent_claims").upsert({ agent_id: challenge.agent_id, chain_id: 56, registry_address: agent.contract_address.toLowerCase(), owner_address: body.address.toLowerCase(), signature: body.signature, verified_at: new Date().toISOString() }, { onConflict: "chain_id,registry_address,agent_id" });
    if (claimError) return NextResponse.json({ error: "Claim could not be recorded." }, { status: 503 });
    await supabase.from("claim_challenges").update({ used_at: new Date().toISOString() }).eq("nonce", body.nonce);
    return NextResponse.json({ claimed: true, agentId: challenge.agent_id });
  } catch { return NextResponse.json({ error: "Claim verification failed." }, { status: 502 }); }
}
