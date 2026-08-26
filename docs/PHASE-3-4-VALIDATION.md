# Phase 3–4 Validation

Validated: 2026-08-26 UTC

## Phase 3 — Wallet, ownership and claims

- Injected wallet connection and BSC Mainnet switching are implemented with wagmi/viem.
- Both Supabase tables from the applied claim migration returned HTTP 200 through the server-only service role.
- The configured development wallet owns zero BSC ERC-8004 identities according to 8004scan.
- A real claim challenge for agent `265375` from that non-owner wallet returned HTTP 403 with the expected safe rejection.
- The same agent's onchain `ownerOf(265375)` result matches the canonical 8004scan owner.
- A positive persisted claim cannot be performed without a wallet that owns an ERC-8004 identity. No claim row was fabricated.

## Phase 4 — ERC-8183 hiring

- Installed official `@altananetwork/sdk` `0.8.0` from the hackathon Resources documentation.
- Agent `265375` returned a real signed quote through its advertised A2A JSON-RPC endpoint.
- The quote was validated against the SDK's official BSC deployment:
  - chain ID `56`
  - AgenticCommerce verifying contract
  - $U payment token
  - positive price `0.1 $U`
  - expiry
  - negotiation hash
  - provider signature
- AgentDB's production quote API returned HTTP 200 and produced an anchored signed-quote payload suitable for the ERC-8183 job description.
- No transaction or funding was performed.

## Funding blocker

The official atomic `hireErc8183Agent` helper requires an Altana `Wallet` and `Signer`. SDK `0.8.0` describes `signerFromInjected` but does not export it from the public package entry point. The currently connected generic injected wallet is not an Altana wallet, and the configured development wallet has not been provisioned/funded with $U.

AgentDB therefore stops after quote review. It does not replace ERC-8183 with custom escrow or silently send a different transaction sequence.
