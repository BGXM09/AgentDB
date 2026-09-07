"use client";

import { useRef, useState } from "react";
import { useConnect, useConnection, useSignMessage, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { AgentServiceSetup } from "./agent-service-setup";

type State = { tone: "info" | "success" | "warning"; message: string } | null;

export function ClaimAgent({ agentId, registry }: { agentId: string; registry: string }) {
  const connection = useConnection();
  const connect = useConnect();
  const signer = useSignMessage();
  const switcher = useSwitchChain();
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<State>(null);
  const [pending, setPending] = useState(false);
  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);

  async function claim() {
    if (!connection.address) return dialog.current?.showModal();
    setPending(true); setState({ tone: "info", message: "Verifying ownership on BNB Smart Chain…" });
    try {
      if (connection.chainId !== bsc.id) await switcher.switchChainAsync({ chainId: bsc.id });
      const challengeResponse = await fetch("/api/claims/challenge", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ agentId, address: connection.address }) });
      const challenge = await challengeResponse.json() as { message?: string; nonce?: string; error?: string };
      if (!challengeResponse.ok || !challenge.message || !challenge.nonce) throw new Error(challenge.error || "Could not create claim proof.");
      setState({ tone: "info", message: "Ownership verified. Sign the claim proof in your wallet; this does not send a transaction." });
      const signature = await signer.signMessageAsync({ message: challenge.message });
      const verifyResponse = await fetch("/api/claims/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ nonce: challenge.nonce, signature, address: connection.address }) });
      const result = await verifyResponse.json() as { claimed?: boolean; error?: string };
      if (!verifyResponse.ok || !result.claimed) throw new Error(result.error || "Claim verification failed.");
      setVerifiedAddress(connection.address);
      setState({ tone: "success", message: "Ownership verified. You can now set up your agent’s service below." });
    } catch (error) { setState({ tone: "warning", message: error instanceof Error ? error.message : "Claim failed." }); }
    finally { setPending(false); }
  }

  return <><section className="panel claim-panel"><div className="panel-title"><h2>Verify ownership</h2></div><div className="claim-body"><p>Connect the wallet that owns this agent and sign a message. Claiming is free; publishing service changes later requires a BNB Chain transaction.</p><button className="primary-action" disabled={pending} onClick={claim}>{pending ? "Verifying…" : connection.isConnected ? "Verify & claim" : "Connect owner wallet"}</button>{state && <div role="status" className={`notice ${state.tone === "success" ? "success-notice" : state.tone === "warning" ? "warning-notice" : "info-notice"}`}>{state.message}</div>}</div><dialog aria-labelledby="wallet-prompt-title" className="wallet-required-dialog" ref={dialog} onClick={(event) => { if (event.target === dialog.current) dialog.current.close(); }}><div><button className="wallet-dialog-close" aria-label="Close wallet prompt" onClick={() => dialog.current?.close()}>×</button><h2 id="wallet-prompt-title">Connect the owner wallet</h2><p>Choose the wallet that owns this onchain identity.</p>{connect.connectors.map((connector) => <button key={connector.uid} className="primary-action" disabled={connect.isPending} onClick={() => connect.connect({ connector }, { onSuccess: () => dialog.current?.close() })}>{connect.isPending ? "Connecting…" : `Connect ${connector.name}`}</button>)}{!connect.connectors.length && <p>Install a browser wallet, then reload this page to claim your agent.</p>}{connect.error && <p className="wallet-dialog-error" role="alert">{connect.error.message}</p>}<small>Connecting does not send a transaction.</small></div></dialog></section>{verifiedAddress && connection.address?.toLowerCase() === verifiedAddress.toLowerCase() && <AgentServiceSetup agentId={agentId} registry={registry} verifiedAddress={verifiedAddress}/>}</>;
}
