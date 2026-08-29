import { hydrateAgents } from "./load";
import type { ScanAgentDetail, ScanAgentSummary } from "./types";

export function isStudioHireable(agent: ScanAgentDetail): boolean {
  const record = JSON.stringify(agent).toLowerCase();
  const services = agent.services ?? agent.endpoints ?? agent.metadata?.services ?? agent.metadata?.endpoints;
  const hasEndpoint = Array.isArray(services) ? services.length > 0 : Boolean(services && typeof services === "object" && Object.keys(services).length);
  return hasEndpoint && (record.includes("erc8183") || record.includes("erc-8183") || record.includes("/apex"));
}

export async function hireableStudioAgents(items: ScanAgentSummary[]): Promise<ScanAgentDetail[]> {
  const agents = await hydrateAgents(items);
  return agents.filter(isStudioHireable);
}
