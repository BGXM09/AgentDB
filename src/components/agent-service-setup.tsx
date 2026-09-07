"use client";

import { useState } from "react";
import { useConnection, usePublicClient, useWriteContract } from "wagmi";
import { isAddress, type Address } from "viem";
import { identityAbi, parseRegistration, registrationDataUri, updateRegistration } from "@/lib/agents/registration";
import { publicHttpUrl } from "@/lib/agents/endpoints";

export function AgentServiceSetup({ agentId, registry, verifiedAddress }: { agentId: string; registry: string; verifiedAddress: string }) {
  const connection = useConnection();
  const client = usePublicClient({ chainId: 56 });
  const writer = useWriteContract();
  const [source, setSource] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [service, setService] = useState("A2A");
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const authorized = connection.address?.toLowerCase() === verifiedAddress.toLowerCase() && connection.chainId === 56;

  async function loadRegistration() {
    if (!client || !isAddress(registry)) return;
    setBusy(true); setMessage(""); setPreview(null);
    try {
      const uri = await client.readContract({ address: registry, abi: identityAbi, functionName: "tokenURI", args: [BigInt(agentId)] });
      const target = uri.startsWith("ipfs://") ? `https://ipfs.io/ipfs/${uri.slice(7)}` : uri;
      if (!target.startsWith("data:application/json") && !publicHttpUrl(target)) throw new Error("The registration URI cannot be loaded here. Paste the full JSON file below.");
      const response = await fetch(target, { signal: AbortSignal.timeout(12_000) });
      if (!response.ok) throw new Error("The registration file could not be loaded. Paste its full JSON below.");
      const text = await response.text();
      const record = parseRegistration(text);
      setSource(JSON.stringify(record, null, 2));
      setMessage("Current registration loaded. Existing fields will be preserved.");
    } catch (error) { setMessage(error instanceof Error ? `${error.message} If your host blocks browser access, paste the full registration JSON below.` : "Could not load registration. Paste the full JSON below."); }
    finally { setBusy(false); }
  }

  function review(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    try { setPreview(updateRegistration(source, service, endpoint)); }
    catch (error) { setPreview(null); setMessage(error instanceof Error ? error.message : "Check the registration fields."); }
  }

  async function publish() {
    if (!preview || !authorized || !client || !isAddress(registry)) return;
    setBusy(true); setMessage("");
    try {
      const owner = await client.readContract({ address: registry, abi: identityAbi, functionName: "ownerOf", args: [BigInt(agentId)] });
      if (owner.toLowerCase() !== connection.address?.toLowerCase()) throw new Error("This wallet no longer owns the agent. Reconnect the current owner wallet.");
      const { request } = await client.simulateContract({ address: registry, abi: identityAbi, functionName: "setAgentURI", args: [BigInt(agentId), registrationDataUri(preview)], account: connection.address as Address });
      const transactionHash = await writer.writeContractAsync({ address: registry, abi: identityAbi, functionName: "setAgentURI", args: request.args, account: connection.address as Address, chainId: 56 });
      setHash(transactionHash);
      setMessage("Transaction submitted. Waiting for BNB Chain confirmation…");
      const receipt = await client.waitForTransactionReceipt({ hash: transactionHash });
      if (receipt.status !== "success") { setHash(null); throw new Error("The registration update reverted. Your previous registration is still active."); }
      setConfirmed(true);
      setMessage("Service registration published. AgentDB will show it after the indexer refreshes.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Publishing failed. Check your wallet and try again."); }
    finally { setBusy(false); }
  }

  return <section className="owner-setup" aria-labelledby="setup-heading"><h2 id="setup-heading">Make your agent connectable</h2><p>Publish a working service in your ERC-8004 registration. Your service handles the task, pricing, and payment. If it supports ERC-8183 jobs, explain that in its registration and service documentation.</p>
    <form className="hire-form" onSubmit={review}>
      <button type="button" className="secondary-action" onClick={loadRegistration} disabled={busy || Boolean(hash)}>Load current registration</button>
      <label>Complete registration JSON<textarea value={source} onChange={(event) => { setSource(event.target.value); setPreview(null); }} placeholder="Load your current registration or paste the complete JSON file" required disabled={busy || Boolean(hash)} spellCheck={false} rows={8}/></label>
      <div className="setup-service-fields"><label>Connection type<select value={service} onChange={(event) => { setService(event.target.value); setPreview(null); }} disabled={busy || Boolean(hash)}><option value="A2A">A2A · agent client</option><option value="MCP">MCP · tool client</option><option value="web">Web · browser / API</option></select></label><label>Service endpoint<input type="url" value={endpoint} onChange={(event) => { setEndpoint(event.target.value); setPreview(null); }} placeholder="https://your-agent.example/endpoint" required disabled={busy || Boolean(hash)}/></label></div>
      <p className="setup-explanation">This adds or updates the selected service and preserves the other fields. Publishing updates the full registration on BNB Chain and requires a transaction fee. It does not deploy a service or enable payments for you.</p>
      <button className="primary-action" disabled={busy || Boolean(hash)}>Review registration</button>
    </form>
    {preview && <div className="registration-review"><h3>Review before publishing</h3><p>Your registry URI will point to this complete document, stored as a data URI. Check the service URL and all existing fields.</p><pre className="raw-record">{JSON.stringify(preview, null, 2)}</pre><button className="primary-action" onClick={publish} disabled={busy || !authorized || Boolean(hash)}>{confirmed ? "Published" : hash ? "Transaction submitted" : busy ? "Waiting for wallet…" : "Publish on BNB Chain"}</button>{!authorized && <p>Reconnect the verified owner wallet on BNB Chain to publish.</p>}</div>}
    <p role="status" className="setup-status">{message}</p>{hash && <a href={`https://bscscan.com/tx/${hash}`} target="_blank" rel="noreferrer">View registration transaction</a>}
  </section>;
}
