"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { encodeFunctionData, formatEther } from "viem";
import { ALTANA_TESTNET_CHAIN_ID, ALTANA_TESTNET_PAYMENT_TOKEN, ALTANA_TESTNET_USD_FAUCET, altanaTestnetClient, type AltanaPasskeySession } from "@/lib/altana-browser";

type Balance = { native: string; paymentToken: string };
type Value = { session: AltanaPasskeySession | null; balance: Balance | null; busy: boolean; error: string; createWallet(): Promise<void>; recoverWallet(): Promise<void>; refreshBalance(): Promise<void>; requestTestTokens(): Promise<string | undefined>; disconnect(): void };
const Context = createContext<Value | null>(null);

export function AltanaWalletProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AltanaPasskeySession | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const readBalance = useCallback(async (active: AltanaPasskeySession) => {
    const result = await altanaTestnetClient.balances({ wallet: active.wallet, chainId: ALTANA_TESTNET_CHAIN_ID, tokens: [ALTANA_TESTNET_PAYMENT_TOKEN] });
    const token = result.tokens?.[0];
    setBalance({ native: formatEther(result.native), paymentToken: token?.ok ? token.display : "Unavailable" });
  }, []);
  const runWalletAction = useCallback(async (action: () => Promise<AltanaPasskeySession>) => {
    setBusy(true); setError("");
    try { const active = await action(); setSession(active); localStorage.setItem("agentdb.altana.address", active.wallet.address); await readBalance(active); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Altana wallet operation failed."); }
    finally { setBusy(false); }
  }, [readBalance]);
  const createWallet = useCallback(() => runWalletAction(async () => { const result = await altanaTestnetClient.createPasskeyWallet({ name: "AgentDB" }); return { wallet: result, signer: result.signer }; }), [runWalletAction]);
  const recoverWallet = useCallback(() => runWalletAction(async () => { const result = await altanaTestnetClient.recoverFromPasskey({ chainId: ALTANA_TESTNET_CHAIN_ID }); return { wallet: result, signer: result.signer }; }), [runWalletAction]);
  const refreshBalance = useCallback(async () => { if (!session) return; setBusy(true); setError(""); try { await readBalance(session); } catch (cause) { setError(cause instanceof Error ? cause.message : "Balance refresh failed."); } finally { setBusy(false); } }, [readBalance, session]);
  const requestTestTokens = useCallback(async () => {
    if (!session) throw new Error("Create or recover an Altana passkey wallet first.");
    setBusy(true); setError("");
    try { const result = await altanaTestnetClient.execute({ wallet: session.wallet, signer: session.signer, chainId: ALTANA_TESTNET_CHAIN_ID, calls: { to: ALTANA_TESTNET_USD_FAUCET, data: encodeFunctionData({ abi: [{ type: "function", name: "requestTokens", stateMutability: "nonpayable", inputs: [], outputs: [] }], functionName: "requestTokens" }) } }); await readBalance(session); return result.transactionHash; }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Test-token request failed."); throw cause; }
    finally { setBusy(false); }
  }, [readBalance, session]);
  const disconnect = useCallback(() => { setSession(null); setBalance(null); setError(""); }, []);
  const value = useMemo(() => ({ session, balance, busy, error, createWallet, recoverWallet, refreshBalance, requestTestTokens, disconnect }), [session, balance, busy, error, createWallet, recoverWallet, refreshBalance, requestTestTokens, disconnect]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAltanaWallet() { const value = useContext(Context); if (!value) throw new Error("AltanaWalletProvider is missing."); return value; }
