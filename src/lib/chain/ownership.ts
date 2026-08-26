import { createPublicClient, http, isAddress, type Address } from "viem";
import { bsc } from "viem/chains";

const ownerOfAbi = [{ type: "function", name: "ownerOf", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "owner", type: "address" }] }] as const;

export function addressesEqual(left: string, right: string) {
  const normalizedLeft = left.toLowerCase();
  const normalizedRight = right.toLowerCase();
  return isAddress(normalizedLeft) && isAddress(normalizedRight) && normalizedLeft === normalizedRight;
}

export async function readAgentOwner(registry: string, tokenId: string): Promise<Address> {
  if (!isAddress(registry) || !/^\d+$/.test(tokenId)) throw new Error("Invalid identity registry or agent ID.");
  const rpcUrl = process.env.BSC_MAINNET_RPC_URL;
  if (!rpcUrl) throw new Error("BSC Mainnet RPC is not configured.");
  const client = createPublicClient({ chain: bsc, transport: http(rpcUrl) });
  return client.readContract({ address: registry, abi: ownerOfAbi, functionName: "ownerOf", args: [BigInt(tokenId)] });
}
