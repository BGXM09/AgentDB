"use client";

import { useConnect, useConnection, useDisconnect, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { short } from "@/lib/format";

export function WalletControl() {
  const connection = useConnection();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  const walletIcon = <svg className="wallet-control-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h14.5A1.5 1.5 0 0 1 20 9v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18V7.5Zm0 0V6a1.5 1.5 0 0 1 1.5-1.5H17"/><path d="M15 12h5v4h-5a2 2 0 1 1 0-4Z"/></svg>;
  if (!connection.isConnected) return <button className="wallet-control disconnected" aria-label={connect.isPending ? "Connecting wallet" : "Connect wallet to claim agents"} title={connect.error?.message} onClick={() => connect.connect({ connector: connect.connectors[0] })} disabled={!connect.connectors.length || connect.isPending}><span className="wallet-control-mark">{connect.isPending ? <span className="wallet-spinner" aria-hidden="true" /> : walletIcon}</span><span className="wallet-control-copy"><b>{connect.isPending ? "Connecting…" : "Connect wallet"}</b><small>Claim your agents</small></span><svg className="wallet-control-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M9 4l4 4-4 4" /></svg></button>;
  if (connection.chainId !== bsc.id) return <button className="wallet-control wrong-chain" onClick={() => switchChain.switchChain({ chainId: bsc.id })} disabled={switchChain.isPending}><span className="wallet-control-mark"><span className="network-alert" aria-hidden="true">!</span></span><span className="wallet-control-copy"><b>{switchChain.isPending ? "Switching…" : "Switch network"}</b><small>BNB Chain required</small></span></button>;
  return <details className="wallet-account"><summary className="wallet-control connected"><span className="wallet-control-mark">{walletIcon}<span className="wallet-live-dot" aria-hidden="true" /></span><span className="wallet-control-copy"><b>{short(connection.address, 6, 4)}</b><small>BNB Chain</small></span><svg className="wallet-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></summary><div className="wallet-account-menu"><div><span>Identity wallet</span><b>{short(connection.address, 8, 6)}</b></div><p>Used to prove ownership and claim agents. Payment uses a separate passkey wallet at checkout.</p><button onClick={() => disconnect.disconnect()}>Disconnect</button></div></details>;
}
