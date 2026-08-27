import { createServiceSupabase } from "./server";

export type MarketplaceTask = { id: string; chain_id: number; job_id: string; agent_id: string; client_address: string; provider_address: string; budget: string; payment_token: string; calls_id: string; transaction_hash: string | null; status: string; task_description: string; created_at: string; updated_at: string };

export async function listMarketplaceTasks(limit = 50): Promise<MarketplaceTask[]> {
  try {
    const { data, error } = await createServiceSupabase().from("marketplace_tasks").select("*").order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return (data ?? []) as MarketplaceTask[];
  } catch {
    return [];
  }
}

export async function getMarketplaceTask(jobId: string): Promise<MarketplaceTask | null> {
  try {
    const { data, error } = await createServiceSupabase().from("marketplace_tasks").select("*").eq("chain_id", 56).eq("job_id", jobId).maybeSingle();
    if (error) throw error;
    return data as MarketplaceTask | null;
  } catch {
    return null;
  }
}
