"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useConnect, useConnection, useDisconnect, useSwitchChain } from "wagmi";
import { AgentProfileEditor } from "./agent-profile-editor";

type Agent = { id: string; registry: string; name: string; description: string };
export function OwnerDashboard() {
  const connection = useConnection();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const switcher = useSwitchChain();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setAgents([]); setSelected(null); setError("");
    if (!connection.address) { setLoading(false); return; }
    setLoading(true);
    fetch(`/api/dashboard/agents?address=${connection.address}`, { signal: controller.signal }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (!controller.signal.aborted) { setAgents(data.agents); if (data.incomplete) setError("Some agents could not be checked. Refresh to try again."); }
    }).catch((e) => { if (!controller.signal.aborted) setError(e.message || "Could not load agents."); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [connection.address, revision]);

  if (!connection.isConnected) return <section className="dashboard-welcome"><div><h2>A home for the agents you own.</h2><p>Connect the wallet you used to claim your agent. Your claimed agents will appear here, ready to manage.</p><button className="primary-action" disabled={connect.isPending || !connect.connectors.length} onClick={() => connect.connect({ connector: connect.connectors[0] })}>{connect.isPending ? "Connecting…" : "Connect owner wallet"}</button>{!connect.connectors.length && <p>Install or enable a browser wallet, then reload this page.</p>}{connect.error && <p role="alert">{connect.error.message}</p>}<small>Connecting does not send a transaction.</small></div><ol><li><b>Claim your agent</b><span>Prove ownership with a wallet signature.</span></li><li><b>Make it yours</b><span>Edit profile details and service connections.</span></li><li><b>Review and publish</b><span>Approve the registration update in your wallet.</span></li></ol></section>;

  return <><div className="dashboard-toolbar"><div><span>Owner wallet</span><code>{connection.address}</code></div><button className="secondary-action" onClick={() => disconnect.disconnect()}>Disconnect</button></div>{connection.chainId !== 56 && <div className="notice warning-notice">Switch to BNB Chain to publish changes. <button className="primary-action" disabled={switcher.isPending} onClick={() => switcher.switchChain({ chainId: 56 })}>Switch network</button>{switcher.error && <p role="alert">{switcher.error.message}</p>}</div>}<div className="dashboard-list-heading"><h2>Claimed agents</h2><button className="secondary-action" disabled={loading} onClick={() => setRevision((v) => v + 1)}>Refresh</button></div>{error && <p role="alert" className="notice warning-notice">{error}</p>}{loading ? <p role="status">Checking your claims and current ownership…</p> : agents.length ? <div className="dashboard-workspace"><aside aria-label="Select an agent">{agents.map((agent) => <button key={`${agent.registry}-${agent.id}`} aria-pressed={selected?.id === agent.id && selected?.registry === agent.registry} onClick={() => setSelected(agent)}><b>{agent.name}</b><span>Agent #{agent.id}</span></button>)}<Link href="/search">Claim another agent</Link></aside><div>{selected ? <AgentProfileEditor key={`${connection.address}-${selected.registry}-${selected.id}`} agent={selected} ownerAddress={connection.address!} /> : <div className="dashboard-placeholder"><h3>Select an agent to edit.</h3><p>Update its profile and services, then review the full registration before publishing.</p></div>}</div></div> : !error && <section className="dashboard-placeholder"><h3>No claimed agents for this wallet yet.</h3><p>Find your agent’s listing and choose “Claim this Agent”. Only agents this wallet currently owns appear here.</p><Link className="primary-action" href="/search">Find your agent</Link></section>}</>;
}
