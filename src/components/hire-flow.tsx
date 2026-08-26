"use client";

import { useState } from "react";
import { useConnection } from "wagmi";
import type { Quote } from "@/lib/commerce/types";
import Link from "next/link";
import { useAltanaWallet } from "./altana-wallet-provider";

const defaults = { taskDescription: "Inspect the current PancakeSwap V3 BNB/USDT LP range and return a read-only live position report. Do not execute trades or move funds.", deliverables: "A human-readable position report with current range status and evidence sources.", qualityStandards: "Use current BNB Chain data, cite transaction or pool evidence, and do not execute any transaction." };

export function HireFlow({ agentId, agentName }: { agentId: string; agentName: string }) {
  const connection = useConnection();
  const altana = useAltanaWallet();
  const [form, setForm] = useState(defaults);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function requestQuote(event: React.FormEvent) {
    event.preventDefault(); setPending(true); setError(""); setQuote(null);
    try { const response = await fetch("/api/commerce/erc8183/quote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ agentId, ...form }) }); const result = await response.json() as Quote & { error?: string }; if (!response.ok) throw new Error(result.error || "Quote failed."); setQuote(result); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Quote failed."); }
    finally { setPending(false); }
  }
  return <div className="hire-layout"><section className="panel hire-main"><div className="panel-title"><h2>1. Select Service & Configure</h2><span>Agent-declared service</span></div><form className="hire-form" onSubmit={requestQuote}><label>Service<input value="Live LP Position Report" disabled /></label><label>Task<textarea value={form.taskDescription} onChange={(e) => setForm({ ...form, taskDescription: e.target.value })} required /></label><label>Expected deliverable<textarea value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} required /></label><label>Quality standards<textarea value={form.qualityStandards} onChange={(e) => setForm({ ...form, qualityStandards: e.target.value })} required /></label><button className="primary-action" disabled={pending}>{pending ? "Requesting real quote…" : "Request Quote"}</button>{error && <div className="notice warning-notice">{error}</div>}</form></section>
    <aside><section className="panel quote-panel"><div className="panel-title"><h2>2. Quote</h2></div>{quote ? <dl className="detail-list compact-list"><div><dt>Agent</dt><dd>{agentName} #{agentId}</dd></div><div><dt>Price</dt><dd><b>{quote.priceDisplay}</b></dd></div><div><dt>Payment token</dt><dd><code>{quote.currency}</code></dd></div><div><dt>Estimated duration</dt><dd>{Math.ceil(quote.estimatedCompletionSeconds / 60)} minutes</dd></div><div><dt>Expires</dt><dd>{new Date(quote.expiresAt * 1000).toLocaleString()}</dd></div><div><dt>Settlement</dt><dd>Official ERC-8183 optimistic escrow</dd></div><div><dt>Provider signature</dt><dd><code>{quote.providerSignature.slice(0, 14)}…{quote.providerSignature.slice(-10)}</code></dd></div></dl> : <div className="empty">No transaction occurs when requesting a quote.</div>}</section>
      <section className="panel quote-panel"><div className="panel-title"><h2>3. Permissions & Review</h2></div><div className="review-body"><p><b>Task scope:</b> Read-only report. No delegated contract permissions are requested by this quote.</p><p><b>Capital involved:</b> Quote price only; no strategy capital is authorized.</p><p><b>Identity wallet:</b> {connection.address || "Not connected"}</p><p><b>Altana buyer wallet:</b> {altana.session?.wallet.address || "Not provisioned"}</p><div className="notice warning-notice"><b>This real quote is BSC Mainnet only (chain 56).</b> Testnet-first funding remains disabled until the seller provides a signed chain-97 quote against the official testnet ERC-8183 contracts. AgentDB will not rewrite or replay these terms.</div><Link className="primary-action button-link" href="/wallet/altana">Set up official Altana wallet</Link> <button className="primary-action" disabled>Hire & Fund ERC-8183 Job</button></div></section>
    </aside></div>;
}
