"use client";

import { useState } from "react";
import type { Quote } from "@/lib/commerce/types";
import Link from "next/link";
import { useAltanaWallet } from "./altana-wallet-provider";

const defaults = { taskDescription: "Inspect the current PancakeSwap V3 BNB/USDT LP range and return a read-only live position report. Do not execute trades or move funds.", deliverables: "A human-readable position report with current range status and evidence sources.", qualityStandards: "Use current BNB Chain data, cite transaction or pool evidence, and do not execute any transaction." };

export function HireFlow({ agentId, agentName }: { agentId: string; agentName: string }) {
  const altana = useAltanaWallet();
  const [form, setForm] = useState(defaults);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [fundedJob, setFundedJob] = useState<{ jobId: string; transactionHash?: string } | null>(null);
  async function requestQuote(event: React.FormEvent) {
    event.preventDefault(); setPending(true); setError(""); setQuote(null);
    try { const response = await fetch("/api/commerce/erc8183/quote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ agentId, ...form }) }); const result = await response.json() as Quote & { error?: string }; if (!response.ok) throw new Error(result.error || "Quote failed."); setQuote(result); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Quote failed."); }
    finally { setPending(false); }
  }
  async function fundJob() {
    if (!quote || !altana.session) return;
    if (!window.confirm(`Pay ${quote.priceDisplay} and start this task? This is a real payment.`)) return;
    setPending(true); setError("");
    try {
      const result = await altana.hire(quote);
      const response = await fetch("/api/tasks/record", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jobId: result.jobId, agentId, clientAddress: altana.session.wallet.address, providerAddress: quote.provider, budget: quote.price, paymentToken: quote.currency, callsId: result.callsId, transactionHash: result.transactionHash, taskDescription: quote.anchoredTask }) });
      const record = await response.json() as { error?: string };
      if (!response.ok) throw new Error(record.error || "Funded job could not be recorded.");
      setFundedJob({ jobId: result.jobId, transactionHash: result.transactionHash });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Job funding failed."); }
    finally { setPending(false); }
  }
  return <div className="consumer-hire-layout"><section className="consumer-hire-form"><h2>Your task</h2><form className="hire-form" onSubmit={requestQuote}><label>Service<input value="Live LP position report" disabled /></label><label>What should the agent do?<textarea value={form.taskDescription} onChange={(e) => setForm({ ...form, taskDescription: e.target.value })} required /></label><label>What result do you want back?<textarea value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} required /></label><label>Anything it must or must not do?<textarea value={form.qualityStandards} onChange={(e) => setForm({ ...form, qualityStandards: e.target.value })} required /></label><button className="primary-action" disabled={pending}>{pending ? "Getting your price…" : "See price and delivery time"}</button>{error && <div className="notice warning-notice">{error}</div>}</form></section>
    <aside className="consumer-order-summary"><h2>Your order</h2><div className="order-agent"><span>Agent</span><b>{agentName}</b></div>{quote ? <dl><div><dt>Total price</dt><dd>{quote.priceDisplay}</dd></div><div><dt>Delivery estimate</dt><dd>{Math.ceil(quote.estimatedCompletionSeconds / 60)} minutes</dd></div><div><dt>Quote valid until</dt><dd>{new Date(quote.expiresAt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</dd></div></dl> : <div className="quote-placeholder"><b>No surprises.</b><p>Your price and delivery estimate will appear here. Asking for a quote is free.</p></div>}<div className="payment-note"><b>Your payment is protected</b><p>The agent is paid through an onchain job, creating a permanent record of what you ordered.</p></div>{!altana.session && quote && <Link className="primary-action button-link" href="/wallet/altana">Set up payment</Link>}<button className="primary-action" disabled={!quote || !altana.session || pending || Boolean(fundedJob)} onClick={() => void fundJob()}>{fundedJob ? `Task #${fundedJob.jobId} started` : pending ? "Starting task…" : "Pay and start task"}</button>{fundedJob && <div className="notice success-notice">Task #{fundedJob.jobId} is now tracked in AgentDB.{fundedJob.transactionHash && <> <a href={`https://bscscan.com/tx/${fundedJob.transactionHash}`} target="_blank" rel="noreferrer">View receipt</a></>}</div>}<details><summary>Payment details</summary><p>Payment uses BNB Smart Chain and protected ERC-8183 job settlement.</p><code>{quote?.currency || "Payment token shown after quote"}</code></details>{error && <div className="notice warning-notice">{error}</div>}</aside></div>;
}
