"use client";
import { useState } from "react";
import { useConnect, useConnection, usePublicClient, useSwitchChain, useWriteContract } from "wagmi";
import { bsc } from "wagmi/chains";
import type { Quote } from "@/lib/commerce/types";
import { commerceAbi, erc20Abi, ERC8183_ADDRESSES, policyAbi, routerAbi } from "@/lib/commerce/contracts";

const defaults = { taskDescription: "", deliverables: "A clear result I can review in AgentDB.", qualityStandards: "Use current sources and include evidence for the result." };

export function HireFlow({ agentId, agentName }: { agentId: string; agentName: string }) {
  const connection = useConnection(); const connect = useConnect(); const switchChain = useSwitchChain();
  const publicClient = usePublicClient({ chainId: bsc.id }); const writer = useWriteContract();
  const [form, setForm] = useState(defaults); const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState(""); const [pending, setPending] = useState(false); const [progress, setProgress] = useState("");
  const [fundedJob, setFundedJob] = useState<{ jobId: string; transactionHash: string } | null>(null);
  const addresses = ERC8183_ADDRESSES[56];

  async function requestQuote(event: React.FormEvent) {
    event.preventDefault(); setPending(true); setError(""); setQuote(null);
    try { const response = await fetch("/api/commerce/erc8183/quote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ agentId, ...form }) }); const result = await response.json() as Quote & { error?: string }; if (!response.ok) throw new Error(result.error || "We couldn't get a current price from this agent."); setQuote(result); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "This agent is temporarily unavailable."); } finally { setPending(false); }
  }
  async function send(label: string, request: Parameters<typeof writer.writeContractAsync>[0]) { setProgress(label); const hash = await writer.writeContractAsync(request); await publicClient!.waitForTransactionReceipt({ hash }); return hash; }
  async function startAgent() {
    if (!quote || !connection.address || !publicClient) return; setPending(true); setError("");
    try {
      const [counter, disputeWindow] = await Promise.all([publicClient.readContract({ address: addresses.commerce, abi: commerceAbi, functionName: "jobCounter" }), publicClient.readContract({ address: addresses.policy, abi: policyAbi, functionName: "disputeWindow" })]);
      const jobId = counter + BigInt(1); const budget = BigInt(quote.price); const expiredAt = BigInt(Math.floor(Date.now() / 1000)) + disputeWindow + BigInt(Math.max(1800, quote.estimatedCompletionSeconds));
      await send("Creating your task", { address: addresses.commerce, abi: commerceAbi, functionName: "createJob", args: [quote.provider, addresses.router, expiredAt, quote.anchoredTask, addresses.router] });
      await send("Adding payment protection", { address: addresses.router, abi: routerAbi, functionName: "registerJob", args: [jobId, addresses.policy] });
      await send("Setting the agreed price", { address: addresses.commerce, abi: commerceAbi, functionName: "setBudget", args: [jobId, budget, "0x"] });
      await send("Approving payment", { address: addresses.paymentToken, abi: erc20Abi, functionName: "approve", args: [addresses.commerce, budget] });
      const transactionHash = await send("Starting your agent", { address: addresses.commerce, abi: commerceAbi, functionName: "fund", args: [jobId, budget, "0x"] });
      const response = await fetch("/api/tasks/record", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jobId: jobId.toString(), agentId, clientAddress: connection.address, providerAddress: quote.provider, budget: quote.price, paymentToken: quote.currency, transactionHash, taskDescription: quote.anchoredTask }) }); const record = await response.json() as { error?: string }; if (!response.ok) throw new Error(record.error || "Your task started, but it could not be added to My Agents.");
      setFundedJob({ jobId: jobId.toString(), transactionHash }); setProgress("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "We couldn't start this agent."); } finally { setPending(false); }
  }
  return <div className="consumer-hire"><ol className="checkout-steps" aria-label="Hiring progress"><li className={!quote ? "active" : "done"}>Describe</li><li className={quote && !fundedJob ? "active" : fundedJob ? "done" : ""}>Review</li><li className={fundedJob ? "active" : ""}>Running</li></ol>
    {!quote ? <section className="panel hire-main"><div className="panel-title"><h2>What should {agentName} do?</h2></div><form className="hire-form" onSubmit={requestQuote}><label>Your task<textarea placeholder="Describe the outcome you need" value={form.taskDescription} onChange={(e) => setForm({ ...form, taskDescription: e.target.value })} required autoFocus /></label><details><summary>Set result requirements</summary><label>Expected result<textarea value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} required /></label><label>Quality requirements<textarea value={form.qualityStandards} onChange={(e) => setForm({ ...form, qualityStandards: e.target.value })} required /></label></details><button className="primary-action" disabled={pending}>{pending ? "Preparing your agent..." : "Get price"}</button>{error && <div className="notice warning-notice"><b>This agent is temporarily unavailable.</b><p>{error}</p></div>}</form></section>
    : fundedJob ? <section className="panel checkout-success"><span className="success-check">✓</span><h2>{agentName} is running</h2><p>Your task is funded and now tracked in My Agents.</p><a className="primary-action button-link" href={`/tasks/${fundedJob.jobId}`}>View progress</a><a href={`https://bscscan.com/tx/${fundedJob.transactionHash}`} target="_blank" rel="noreferrer">View payment details</a></section>
    : <section className="panel review-checkout"><div className="review-heading"><div><span>Ready to start</span><h2>{agentName}</h2></div><strong>{quote.priceDisplay}</strong></div><div className="review-summary"><p>{form.taskDescription}</p><dl><div><dt>Result</dt><dd>{form.deliverables}</dd></div><div><dt>Estimated time</dt><dd>{Math.max(1, Math.ceil(quote.estimatedCompletionSeconds / 60))} minutes</dd></div><div><dt>Payment</dt><dd>Protected until the agent delivers</dd></div></dl></div><div className="checkout-actions"><button className="secondary-action" onClick={() => setQuote(null)} disabled={pending}>Edit</button>{!connection.isConnected ? <button className="primary-action" onClick={() => connect.connect({ connector: connect.connectors[0] })} disabled={!connect.connectors.length || connect.isPending}>Connect wallet</button> : connection.chainId !== bsc.id ? <button className="primary-action" onClick={() => switchChain.switchChain({ chainId: bsc.id })}>Switch network</button> : <button className="primary-action" onClick={() => void startAgent()} disabled={pending}>{pending ? progress || "Starting..." : `Start for ${quote.priceDisplay}`}</button>}</div>{error && <div className="notice warning-notice"><b>We couldn't start {agentName}.</b><p>{error}</p></div>}<details className="technical-disclosure"><summary>Technical details</summary><p>This creates and funds a protected ERC-8183 job on BNB Smart Chain. Your wallet will ask you to approve each required transaction.</p></details></section>}
  </div>;
}
