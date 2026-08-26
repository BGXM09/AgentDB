import { BNB_TESTNET, ERC8183_ADDRESSES, createClient, type PasskeySigner, type Wallet } from "@altananetwork/sdk";

export const ALTANA_TESTNET_CHAIN_ID = 97;
export const ALTANA_TESTNET_USD_FAUCET = "0x86e9197CC0F76E4e4aaa7082180945196bBAb5D3" as const;
export const ALTANA_TESTNET_EXPLORER = BNB_TESTNET.explorer;
export const ALTANA_TESTNET_PAYMENT_TOKEN = ERC8183_ADDRESSES[ALTANA_TESTNET_CHAIN_ID].paymentToken;
export const altanaTestnetClient = createClient({ chains: [BNB_TESTNET], defaultChainId: ALTANA_TESTNET_CHAIN_ID });
export type AltanaPasskeySession = { wallet: Wallet; signer: PasskeySigner };
