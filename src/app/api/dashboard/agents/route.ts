import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { createServiceSupabase } from "@/lib/supabase/server";
import { getBscAgent } from "@/lib/scan8004/client";
import { addressesEqual, readAgentOwner } from "@/lib/chain/ownership";

export async function GET(request: Request) {
  const address = new URL(request.url).searchParams.get("address");
  if (!address || !isAddress(address)) return NextResponse.json({ error: "Connect a valid owner wallet." }, { status: 400 });
  try {
    const { data, error } = await createServiceSupabase().from("agent_claims").select("agent_id,registry_address").eq("chain_id", 56).eq("owner_address", address.toLowerCase()).is("revoked_at", null).order("verified_at", { ascending: false }).limit(100);
    if (error) throw error;
    const results = await Promise.allSettled((data || []).map(async (claim) => {
      const owner = await readAgentOwner(claim.registry_address, claim.agent_id);
      if (!addressesEqual(owner, address)) return null;
      const agent = await getBscAgent(claim.agent_id);
      if (!addressesEqual(agent.contract_address, claim.registry_address)) return null;
      return { id: claim.agent_id, registry: claim.registry_address, name: agent.name || `Agent #${claim.agent_id}`, description: agent.description || "" };
    }));
    return NextResponse.json({ agents: results.flatMap((r) => r.status === "fulfilled" && r.value ? [r.value] : []), incomplete: results.some((r) => r.status === "rejected") }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Your claimed agents could not be loaded. Please try again." }, { status: 503 }); }
}
