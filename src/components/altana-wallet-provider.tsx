"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { encodeFunctionData, formatEther } from "viem";
import { BNB, hireErc8183Agent } from "@altananetwork/sdk";
import { ALTANA_MAINNET_CHAIN_ID, ALTANA_MAINNET_PAYMENT_TOKEN, ALTANA_TESTNET_CHAIN_ID, ALTANA_TESTNET_PAYMENT_TOKEN, ALTANA_TESTNET_USD_FAUCET, altanaClient, type AltanaPasskeySession } from "@/lib/altana-browser";
import type { Quote } from "@/lib/commerce/types";

type Balance = { native: string; paymentToken: string; mainnetNative: string; mainnetPaymentToken: string };
type HireResult = { jobId: string; callsId: `0x${string}`; transactionHash?: `0x${string}`; status: string };
type Value = { session: AltanaPasskeySession | null; balance: Balance | null; busy: boolean; error: string; createWallet(): Promise<void>; recoverWallet(): Promise<void>; refreshBalance(): Promise<void>; requestTestTokens(): Promise<string | undefined>; hire(quote: Quote): Promise<HireResult>; disconnect(): void };
const Context = createContext<Value | null>(null);

export function AltanaWalletProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AltanaPasskeySession | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const readBalance = useCallback(async (active: AltanaPasskeySession) => {
    const [testnet, mainnet] = await Promise.all([
      altanaClient.balances({ wallet: active.wallet, chainId: ALTANA_TESTNET_CHAIN_ID, tokens: [ALTANA_TESTNET_PAYMENT_TOKEN] }),
      altanaClient.balances({ wallet: active.wallet, chainId: ALTANA_MAINNET_CHAIN_ID, tokens: [ALTANA_MAINNET_PAYMENT_TOKEN] }),
    ]);
    setBalance({ native: formatEther(testnet.native), paymentToken: testnet.tokens?.[0]?.ok ? testnet.tokens[0].display : "Unavailable", mainnetNative: formatEther(mainnet.native), mainnetPaymentToken: mainnet.tokens?.[0]?.ok ? mainnet.tokens[0].display : "Unavailable" });
  }, []);
  const runWalletAction = useCallback(async (action: () => Promise<AltanaPasskeySession>) => {
    setBusy(true); setError("");
    try { const active = await action(); setSession(active); localStorage.setItem("agentdb.altana.address", active.wallet.address); await readBalance(active); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Altana wallet operation failed."); }
    finally { setBusy(false); }
  }, [readBalance]);
  const createWallet = useCallback(() => runWalletAction(async () => { const result = await altanaClient.createPasskeyWallet({ name: "AgentDB" }); return { wallet: result, signer: result.signer }; }), [runWalletAction]);
  const recoverWallet = useCallback(() => runWalletAction(async () => { const result = await altanaClient.recoverFromPasskey({ chainId: ALTANA_MAINNET_CHAIN_ID }); return { wallet: result, signer: result.signer }; }), [runWalletAction]);
  const refreshBalance = useCallback(async () => { if (!session) return; setBusy(true); setError(""); try { await readBalance(session); } catch (cause) { setError(cause instanceof Error ? cause.message : "Balance refresh failed."); } finally { setBusy(false); } }, [readBalance, session]);
  const requestTestTokens = useCallback(async () => {
    if (!session) throw new Error("Create or recover an Altana passkey wallet first.");
    setBusy(true); setError("");
    try { const result = await altanaClient.execute({ wallet: session.wallet, signer: session.signer, chainId: ALTANA_TESTNET_CHAIN_ID, calls: { to: ALTANA_TESTNET_USD_FAUCET, data: encodeFunctionData({ abi: [{ type: "function", name: "requestTokens", stateMutability: "nonpayable", inputs: [], outputs: [] }], functionName: "requestTokens" }) } }); await readBalance(session); return result.transactionHash; }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Test-token request failed."); throw cause; }
    finally { setBusy(false); }
  }, [readBalance, session]);
  const hire = useCallback(async (quote: Quote): Promise<HireResult> => {
    if (!session) throw new Error("Create or recover an Altana passkey wallet first.");
    if (quote.chainId !== ALTANA_MAINNET_CHAIN_ID || quote.currency.toLowerCase() !== ALTANA_MAINNET_PAYMENT_TOKEN.toLowerCase()) throw new Error("Quote does not use the supported BSC mainnet payment rail.");
    if (quote.expiresAt <= Math.floor(Date.now() / 1000)) throw new Error("Quote expired. Request a fresh quote.");
    setBusy(true); setError("");
    try {
      const result = await hireErc8183Agent(session.wallet, session.signer, { provider: quote.provider, task: quote.anchoredTask, budget: BigInt(quote.price), deadlineSeconds: Math.max(1800, quote.estimatedCompletionSeconds) }, { network: BNB });
      await readBalance(session);
      return { jobId: result.jobId.toString(), callsId: result.callsId, transactionHash: result.transactionHash, status: result.status };
    } catch (cause) { const message = cause instanceof Error ? cause.message : "ERC-8183 funding failed."; setError(message); throw cause; }
    finally { setBusy(false); }
  }, [readBalance, session]);
  const disconnect = useCallback(() => { setSession(null); setBalance(null); setError(""); }, []);
  const value = useMemo(() => ({ session, balance, busy, error, createWallet, recoverWallet, refreshBalance, requestTestTokens, hire, disconnect }), [session, balance, busy, error, createWallet, recoverWallet, refreshBalance, requestTestTokens, hire, disconnect]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAltanaWallet() { const value = useContext(Context); if (!value) throw new Error("AltanaWalletProvider is missing."); return value; }
