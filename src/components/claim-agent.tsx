"use client";

import { useRef, useState } from "react";
import { useConnect, useConnection, useSignMessage, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";

type State = { tone: "info" | "success" | "warning"; message: string } | null;

export function ClaimAgent({ agentId }: { agentId: string }) {
  const connection = useConnection();
  const connect = useConnect();
  const signer = useSignMessage();
  const switcher = useSwitchChain();
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<State>(null);
  const [pending, setPending] = useState(false);

  async function claim() {
    if (!connection.address) return dialog.current?.showModal();
    if (connection.chainId !== bsc.id) { switcher.switchChain({ chainId: bsc.id }); return; }
    setPending(true); setState({ tone: "info", message: "Verifying ownership on BNB Smart Chain…" });
    try {
      const challengeResponse = await fetch("/api/claims/challenge", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ agentId, address: connection.address }) });
      const challenge = await challengeResponse.json() as { message?: string; nonce?: string; error?: string };
      if (!challengeResponse.ok || !challenge.message || !challenge.nonce) throw new Error(challenge.error || "Could not create claim proof.");
      setState({ tone: "info", message: "Ownership verified. Sign the claim proof in your wallet; this does not send a transaction." });
      const signature = await signer.signMessageAsync({ message: challenge.message });
      const verifyResponse = await fetch("/api/claims/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ nonce: challenge.nonce, signature, address: connection.address }) });
      const result = await verifyResponse.json() as { claimed?: boolean; error?: string };
      if (!verifyResponse.ok || !result.claimed) throw new Error(result.error || "Claim verification failed.");
      setState({ tone: "success", message: "Agent ownership verified and claim recorded." });
    } catch (error) { setState({ tone: "warning", message: error instanceof Error ? error.message : "Claim failed." }); }
    finally { setPending(false); }
  }

  async function connectWallet() {
    const connector = connect.connectors[0];
    if (!connector) return;
    connect.connect({ connector }, { onSuccess: () => dialog.current?.close() });
  }

  return <section className="panel claim-panel"><div className="panel-title"><h2>Claim this Agent</h2><span>Owner-only</span></div><div className="claim-body"><p>Prove control of the current ERC-8004 owner wallet to manage AgentDB enrichment. No private key is requested and no transaction is sent.</p><button className="primary-action" disabled={pending} onClick={claim}>{pending ? "Verifying…" : connection.isConnected ? "Verify & Claim" : "Claim this agent"}</button>{state && <div className={`notice ${state.tone === "success" ? "success-notice" : state.tone === "warning" ? "warning-notice" : "info-notice"}`}>{state.message}</div>}</div><dialog className="wallet-required-dialog" ref={dialog} onClick={(event) => { if (event.target === dialog.current) dialog.current.close(); }}><div><button className="wallet-dialog-close" aria-label="Close wallet prompt" onClick={() => dialog.current?.close()}>×</button><h2>Connect the owner wallet</h2><p>AgentDB only asks for your wallet here because claiming requires proof that you own this onchain identity.</p><button className="primary-action" disabled={!connect.connectors.length || connect.isPending} onClick={connectWallet}>{connect.isPending ? "Connecting…" : "Connect wallet"}</button>{connect.error && <p className="wallet-dialog-error">{connect.error.message}</p>}<small>Connecting does not send a transaction.</small></div></dialog></section>;
}
