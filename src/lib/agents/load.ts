import { getBscAgent } from "@/lib/scan8004/client";
import type { ScanAgentDetail, ScanAgentSummary } from "./types";

export async function hydrateAgents(items: ScanAgentSummary[], limit = items.length): Promise<ScanAgentDetail[]> {
  const selected = items.slice(0, limit);
  const results = await Promise.allSettled(selected.map((agent) => getBscAgent(agent.token_id)));
  return selected.map((summary, index) => results[index].status === "fulfilled" ? results[index].value : summary);
}
