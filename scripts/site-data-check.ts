import nextEnv from "@next/env";
import { createServiceSupabase } from "../src/lib/supabase/server";

nextEnv.loadEnvConfig(process.cwd());
if (process.argv.includes("--search")) {
  const spec = await (await fetch("https://api.8004scan.io/openapi.json")).json();
  console.log(JSON.stringify(spec.paths["/api/v1/agents"].get.parameters.map((p: { name: string; description?: string }) => ({ name: p.name, description: p.description }))));
  for (const path of ["/agents?chain_id=56&search=grid&limit=5", "/agents/search/semantic?q=grid&chain_id=56&limit=25"]) {
    const started = Date.now();
    try {
      const response = await fetch(`https://api.8004scan.io/api/v1${path}`, { headers: { "X-API-Key": process.env.SCAN8004_API_KEY! }, signal: AbortSignal.timeout(15_000) });
      const result = await response.json();
      console.log(JSON.stringify({ path, status: response.status, ms: Date.now() - started, total: result.total, names: result.items?.map((item: { name: string }) => item.name), error: result.error || result.detail || result.message }));
    } catch (error) { console.log(JSON.stringify({ path, error: String(error) })); }
  }
  process.exit(0);
}
const db = createServiceSupabase();
for (const table of ["agent_claims", "claim_challenges", "marketplace_tasks"]) {
  const { error, data } = await db.from(table).select("*").limit(1);
  console.log(JSON.stringify({ table, available: !error, sampleCount: data?.length, error: error?.message }));
}
const response = await fetch("https://api.8004scan.io/api/v1/agents/56/265375", { headers: { "X-API-Key": process.env.SCAN8004_API_KEY! }, signal: AbortSignal.timeout(15_000) });
const agent = await response.json();
console.log(JSON.stringify({ agentStatus: response.status, name: agent.name, services: agent.services, metadataType: agent.raw_metadata?.type, registry: agent.contract_address }));
