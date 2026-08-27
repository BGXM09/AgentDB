"use client";

import { useConnect, useConnection, useDisconnect, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { short } from "@/lib/format";

export function WalletControl() {
  const connection = useConnection();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  if (!connection.isConnected) return <button className="wallet-placeholder wallet-icon-button" aria-label={connect.isPending ? "Connecting wallet" : "Connect wallet"} title={connect.isPending ? "Connecting…" : "Connect wallet"} onClick={() => connect.connect({ connector: connect.connectors[0] })} disabled={!connect.connectors.length || connect.isPending}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h14.5A1.5 1.5 0 0 1 20 9v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18V7.5Zm0 0V6a1.5 1.5 0 0 1 1.5-1.5H17"/><path d="M15 12h5v4h-5a2 2 0 1 1 0-4Z"/></svg></button>;
  if (connection.chainId !== bsc.id) return <button className="wallet-placeholder wrong-chain" onClick={() => switchChain.switchChain({ chainId: bsc.id })} disabled={switchChain.isPending}>{switchChain.isPending ? "Switching…" : "Switch to BSC"}</button>;
  return <div className="wallet-menu"><button className="wallet-placeholder" onClick={() => disconnect.disconnect()} title="Disconnect wallet">{short(connection.address, 6, 4)}</button></div>;
}
