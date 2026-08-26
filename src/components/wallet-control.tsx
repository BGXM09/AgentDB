"use client";

import { useConnect, useConnection, useDisconnect, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { short } from "@/lib/format";

export function WalletControl() {
  const connection = useConnection();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  if (!connection.isConnected) return <button className="wallet-placeholder" onClick={() => connect.connect({ connector: connect.connectors[0] })} disabled={!connect.connectors.length || connect.isPending}>{connect.isPending ? "Connecting…" : "Connect Wallet"}</button>;
  if (connection.chainId !== bsc.id) return <button className="wallet-placeholder wrong-chain" onClick={() => switchChain.switchChain({ chainId: bsc.id })} disabled={switchChain.isPending}>{switchChain.isPending ? "Switching…" : "Switch to BSC"}</button>;
  return <div className="wallet-menu"><button className="wallet-placeholder" onClick={() => disconnect.disconnect()} title="Disconnect wallet">{short(connection.address, 6, 4)}</button></div>;
}
