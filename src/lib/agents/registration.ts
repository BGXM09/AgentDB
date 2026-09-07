import { publicHttpUrl } from "./endpoints";

export const registrationType = "https://eips.ethereum.org/EIPS/eip-8004#registration-v1";
export const identityAbi = [
  { type: "function", name: "ownerOf", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "owner", type: "address" }] },
  { type: "function", name: "tokenURI", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "uri", type: "string" }] },
  { type: "function", name: "setAgentURI", stateMutability: "nonpayable", inputs: [{ name: "agentId", type: "uint256" }, { name: "newURI", type: "string" }], outputs: [] },
] as const;

export function parseRegistration(text: string): Record<string, unknown> {
  if (new TextEncoder().encode(text).length > 48_000) throw new Error("Registration is too large for this editor (48 KB maximum).");
  let value;
  try { value = JSON.parse(text); } catch { throw new Error("Enter a valid registration JSON document."); }
  if (!value || typeof value !== "object" || Array.isArray(value) || value.type !== registrationType || typeof value.name !== "string" || !value.name.trim() || typeof value.description !== "string" || !Array.isArray(value.services)) throw new Error("Use your complete ERC-8004 registration file, including type, name, description, and services.");
  return value;
}

export function updateRegistration(text: string, service: string, endpoint: string) {
  const record = parseRegistration(text);
  if (!["A2A", "MCP", "web"].includes(service)) throw new Error("Choose a supported connection type.");
  const url = publicHttpUrl(endpoint);
  if (!url || !url.startsWith("https:")) throw new Error("Enter a public HTTPS service endpoint without credentials.");
  const services = [...record.services as Record<string, unknown>[]];
  const index = services.findIndex((entry) => entry && typeof entry.name === "string" && entry.name.toLowerCase() === service.toLowerCase());
  if (index >= 0) services[index] = { ...services[index], endpoint: url };
  else services.push({ name: service, endpoint: url });
  return { ...record, services };
}

export function registrationDataUri(record: Record<string, unknown>) {
  const bytes = new TextEncoder().encode(JSON.stringify(record));
  if (bytes.length > 48_000) throw new Error("Registration is too large to publish from this editor.");
  return `data:application/json;base64,${btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""))}`;
}
