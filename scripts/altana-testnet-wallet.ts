import { BNB_TESTNET, createClient, signerFromPrivateKey } from "@altananetwork/sdk";

async function main() {
  const rawKey = process.env.DEV_WALLET_PRIVATE_KEY;
  if (!rawKey) throw new Error("DEV_WALLET_PRIVATE_KEY is not configured.");
  const privateKey = (rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`) as `0x${string}`;
  const client = createClient({ chains: [BNB_TESTNET] });
  const wallet = await client.createWallet({ signer: signerFromPrivateKey(privateKey) });
  console.log(`Altana BSC Testnet wallet: ${wallet.address}`);
}

void main();
