import { createServiceSupabase } from "./server";

export async function getVerifiedClaim(agentId: string, registryAddress: string, currentOwner?: string) {
  try {
    const { data, error } = await createServiceSupabase().from("agent_claims").select("owner_address,verified_at,revoked_at").eq("chain_id", 56).eq("registry_address", registryAddress.toLowerCase()).eq("agent_id", agentId).is("revoked_at", null).maybeSingle();
    if (error) return null;
    if (currentOwner && data?.owner_address.toLowerCase() !== currentOwner.toLowerCase()) return null;
    return data as { owner_address: string; verified_at: string; revoked_at: null } | null;
  } catch { return null; }
}
