"use client";

import Link from "next/link";
import { useState } from "react";
import { useConnection, usePublicClient, useWriteContract } from "wagmi";
import { isAddress, type Address, type Hash } from "viem";
import { identityAbi, parseRegistration, registrationDataUri } from "@/lib/agents/registration";
import { publicHttpUrl } from "@/lib/agents/endpoints";

type Agent = { id: string; registry: string; name: string };
export function AgentProfileEditor({ agent, ownerAddress }: { agent: Agent; ownerAddress: string }) {
  const connection = useConnection();
  const client = usePublicClient({ chainId: 56 });
  const writer = useWriteContract();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [source, setSource] = useState("");
  const [originalUri, setOriginalUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [services, setServices] = useState<Record<string, unknown>[]>([]);
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [hash, setHash] = useState<Hash | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const locked = busy || Boolean(hash);
  const authorized = connection.address?.toLowerCase() === ownerAddress.toLowerCase() && connection.chainId === 56;
  function accept(text: string) {
    const value = parseRegistration(text);
    if ((value.services as unknown[]).some((s) => !s || typeof s !== "object" || Array.isArray(s))) throw new Error("Each service must be a JSON object.");
    setRecord(value); setName(String(value.name)); setDescription(String(value.description)); setImage(typeof value.image === "string" ? value.image : ""); setServices(value.services as Record<string, unknown>[]); setPreview(null);
  }
  async function load() {
    if (!client || !isAddress(agent.registry)) return;
    setBusy(true); setMessage("");
    try {
      const uri = await client.readContract({ address: agent.registry, abi: identityAbi, functionName: "tokenURI", args: [BigInt(agent.id)] });
      setOriginalUri(uri);
      const target = uri.startsWith("ipfs://") ? `https://ipfs.io/ipfs/${uri.slice(7)}` : uri;
      if (!target.startsWith("data:application/json") && !publicHttpUrl(target)) throw new Error("Paste the complete registration JSON below to load this agent.");
      const response = await fetch(target, { signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error("The registration host did not respond.");
      accept(await response.text()); setMessage("Registration loaded. Unedited fields will be preserved.");
    } catch (e) { setMessage(`${e instanceof Error ? e.message : "Could not load registration."} You can paste the full registration below if the host blocks browser access.`); }
    finally { setBusy(false); }
  }
  function review(event: React.FormEvent) {
    event.preventDefault(); setPreview(null); setMessage("");
    try {
      if (!record || !name.trim()) throw new Error("Load your registration and enter an agent name.");
      if (image && !publicHttpUrl(image) && !image.startsWith("ipfs://")) throw new Error("Use a public image URL or an ipfs:// URI.");
      for (const service of services) {
        if (typeof service.name !== "string" || !service.name.trim()) throw new Error("Each service needs a name.");
        if (typeof service.endpoint !== "string" || !service.endpoint.trim()) throw new Error("Each service needs an endpoint.");
        if (/^(https?):/i.test(service.endpoint) && !publicHttpUrl(service.endpoint)) throw new Error("Use a public service URL without embedded credentials.");
      }
      const next = { ...record, name: name.trim(), description, image, services };
      registrationDataUri(next); setPreview(next);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Check your fields."); }
  }
  async function confirm(transaction: Hash) {
    if (!client) return;
    setBusy(true);
    try {
      const receipt = await client.waitForTransactionReceipt({ hash: transaction });
      if (receipt.status !== "success") { setHash(null); throw new Error("Transaction reverted. Your previous registration is still active."); }
      setConfirmed(true); setMessage("Published on BNB Chain. Your public profile will update after the indexer refreshes.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Confirmation is unavailable. Check the transaction or try checking again."); }
    finally { setBusy(false); }
  }
  async function publish() {
    if (!preview || !authorized || !client || !isAddress(agent.registry)) return;
    setBusy(true); setMessage("");
    try {
      const owner = await client.readContract({ address: agent.registry, abi: identityAbi, functionName: "ownerOf", args: [BigInt(agent.id)] });
      if (owner.toLowerCase() !== connection.address?.toLowerCase()) throw new Error("This wallet no longer owns the agent.");
      const uri = await client.readContract({ address: agent.registry, abi: identityAbi, functionName: "tokenURI", args: [BigInt(agent.id)] });
      if (originalUri !== null && originalUri !== uri) throw new Error("The registration changed since you loaded it. Reload before publishing.");
      const args = [BigInt(agent.id), registrationDataUri(preview)] as const;
      await client.simulateContract({ address: agent.registry, abi: identityAbi, functionName: "setAgentURI", args, account: connection.address as Address });
      const transaction = await writer.writeContractAsync({ address: agent.registry, abi: identityAbi, functionName: "setAgentURI", args, account: connection.address as Address, chainId: 56 });
      setHash(transaction); setMessage("Submitted. Waiting for confirmation…");
      await confirm(transaction);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Publishing failed. Try again."); }
    finally { setBusy(false); }
  }
  return <section className="profile-editor"><div className="dashboard-list-heading"><h2>Edit {agent.name}</h2><Link href={`/agents/${agent.id}`}>View profile</Link></div><p>Load the current registration to edit your profile. Ownership and reputation are managed onchain and cannot be changed here.</p><button className="secondary-action" disabled={locked} onClick={load}>{busy && !record ? "Loading…" : "Load current profile"}</button><details className="registration-import"><summary>Import registration JSON</summary><p>Use your complete current registration if automatic loading is unavailable.</p><textarea aria-label="Complete registration JSON" rows={6} value={source} disabled={locked} onChange={(e) => setSource(e.target.value)} /><button className="secondary-action" disabled={locked || !source} onClick={() => { try { accept(source); setMessage("Registration imported."); } catch (e) { setMessage(e instanceof Error ? e.message : "Invalid JSON."); } }}>Use this registration</button></details>
    {record && <form onSubmit={review} onChange={() => setPreview(null)}><fieldset disabled={locked}><legend>Profile details</legend><label>Agent name<input required maxLength={200} value={name} onChange={(e) => setName(e.target.value)} /></label><label htmlFor="agent-description">Description<textarea id="agent-description" required rows={5} maxLength={10000} value={description} onChange={(e) => setDescription(e.target.value)} /></label><label>Profile image URL<input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://… or ipfs://…" /></label></fieldset><fieldset disabled={locked}><legend>Services & connections</legend><p>Keep service names and endpoints accurate. Extra fields on existing services are preserved.</p>{services.map((service, index) => <div className="editor-service" key={index}><label>Service name<input required value={String(service.name ?? "")} onChange={(e) => setServices((items) => items.map((item, i) => i === index ? { ...item, name: e.target.value } : item))} /></label><label>Endpoint<input required value={String(service.endpoint ?? "")} onChange={(e) => setServices((items) => items.map((item, i) => i === index ? { ...item, endpoint: e.target.value } : item))} /></label><button type="button" className="secondary-action" onClick={() => { setServices((items) => items.filter((_, i) => i !== index)); setPreview(null); }}>Remove service {index + 1}</button></div>)}<button type="button" className="secondary-action" onClick={() => { setServices((items) => [...items, { name: "", endpoint: "" }]); setPreview(null); }}>Add service</button></fieldset><button className="primary-action" disabled={locked}>Review changes</button></form>}
    {preview && <div className="editor-review"><h3>Review your update</h3><p>Publishing replaces your registration URI with this complete JSON document as a data URI. Your wallet will ask you to approve a BNB Chain transaction and network fee.</p><pre>{JSON.stringify(preview, null, 2)}</pre><button className="primary-action" disabled={locked || !authorized} onClick={publish}>{confirmed ? "Published" : hash ? "Submitted" : busy ? "Waiting for wallet…" : "Publish changes"}</button>{!authorized && <p>Connect the current owner wallet on BNB Chain to publish.</p>}</div>}
    <p role="status" className="editor-status">{message}</p>{hash && <div className="editor-transaction"><a href={`https://bscscan.com/tx/${hash}`} target="_blank" rel="noreferrer">View transaction</a>{!confirmed && <button className="secondary-action" disabled={busy} onClick={() => confirm(hash)}>Check confirmation</button>}{confirmed && <button className="secondary-action" onClick={() => { setHash(null); setConfirmed(false); setPreview(null); setRecord(null); setMessage("Load your published profile to make another update."); }}>Edit again</button>}</div>}
  </section>;
}
