# AgentDB BSC Agent Supply Audit

Audit date: 2026-08-26 UTC  
Source: 8004scan Developer API, BSC Mainnet (`chain_id=56`), plus direct read-only checks of advertised endpoints.

## Executive finding

8004scan reported **283,402 BSC agent registrations** during the audit. Registration volume does not translate into a deep, proven hiring supply for the four required categories.

We searched all four categories, reviewed more than 60 returned summaries, and deeply inspected **13 potentially useful BSC records**. Only one inspected agent exposed a healthy standard A2A card with explicit ERC-8183 negotiation and funded-job instructions. Several plausible agents had missing services or advertised templated endpoints that returned HTTP 404. No inspected record had ERC-8004 feedback.

The weakest category is **Yield Optimisation**: the search found only three nominal matches, one targets Meteora rather than BSC, and the two BSC-oriented records expose no indexed service endpoint. A separate callable multi-service planner offers a yield-plan service, but 8004scan reports its A2A response as non-conforming.

## Candidate evidence

All entries below are ERC-8004 identities registered on BSC Mainnet. “ERC-8183” means evidence was observed in the description or live service card; it does not by itself prove that a successful job has settled.

| Category | ERC-8004 ID | Agent | Endpoint / service evidence | Pricing | Reputation | Assessment |
|---|---:|---|---|---|---|---|
| Rebalancing | 265375 | BNB LP Range Rebalancer | Healthy A2A card; two explicit ERC-8183 skills: negotiate and notify funded | Quote is negotiated; no fixed price observed | 0 feedback | **Strongest candidate.** Mainnet, callable, ERC-8183-shaped. Domain verification is not complete. |
| Rebalancing | 293054 | bnb-lp-quant.agent | Indexed TermiX-style templated A2A service; manages concentrated-liquidity ranges | Not exposed in indexed record | 0 feedback | Medium category confidence; endpoint/commerce needs live verification. |
| Rebalancing | 45650 | V3 Pools powered by HeyAnon | Healthy MCP service with concentrated-liquidity tools | Not inspected | 0 feedback | Callable execution tooling, but autonomous rebalancing is not established. Low category confidence. |
| Grid Trading | 292939 | bnb-grid-trader-test.agent | Description claims ERC-8183; advertised populated card URL returned 404 | None observed | 0 feedback | High category confidence, not currently callable through tested URL. |
| Grid Trading | 266234 | positioncrew-bounded-grid.agent | Populated A2A URL returned 200, but card reports `OFFLINE` and no skills | Pricing-like fields present, no verified quote | 0 feedback | Real profile, currently not hireable. |
| Grid Trading | 302258 | Brain on BNB — BSC Grid Planner | Endpoint returned 200 and advertises list/negotiate/notify-funded, but is not a valid standard AgentCard according to 8004scan | `0.10 $U` for grid plan | 0 feedback | Callable candidate with pricing; identity wording and non-standard A2A response need resolution. |
| Grid Trading | 267697 | GridMaster Ops (Agent Studio) | No indexed service endpoint | None observed | 0 feedback | Category description is clear; cannot presently verify callability or ERC-8183. |
| Yield Optimisation | 267698 | Yield Compass (Agent Studio) | No indexed service endpoint | None observed | 0 feedback | Strong description, but not callable from indexed metadata. |
| Yield Optimisation | 3416 | HyperOptimizer | No indexed service endpoint | None observed | 0 feedback | Description-only match; insufficient evidence. |
| Yield Optimisation | 133221 | eights.me | MCP, A2A and web services indexed, but description targets Meteora | Not inspected | 0 feedback | Callable-looking record, but wrong ecosystem for the required BSC yield workflow. |
| Health Factor Monitoring | 292058 | bnb-lending-guardian.agent | Explicit Venus health-factor logic; advertised populated card URL returned 404 | None observed | 0 feedback | Excellent category fit, not callable through tested URL. |
| Health Factor Monitoring | 179543 | RiskOracle.agent | Populated A2A URL returned 200; card has no ERC-8183 or pricing evidence | None observed | 0 feedback | Callable profile, commerce compatibility unproven. |
| Multi-category | 302258 | Brain on BNB — BSC Grid Planner | Callable endpoint advertises grid, Venus health factor, yield ranking, and rebalance plans | `0.10 $U` each | 0 feedback | Useful supply lead for every category, but must not be treated as four independently proven execution agents. |

Full canonical owner addresses and registration transactions are available in the internal inspector.

## ERC-8183 and callability

- **Explicit live ERC-8183 interface evidence:** agent `265375`. Its healthy A2A card describes signed quote negotiation, onchain `createJob + fund`, funded-job notification, and onchain delivery retrieval.
- **Callable but non-standard response:** agent `302258`. It returned HTTP 200 and exposed services/prices, while 8004scan marked its A2A result invalid because the response is not an AgentCard.
- **Callable profile without proven commerce:** agents `266234` and `179543`; the former reports itself offline.
- **Failed direct card checks:** agents `292939` and `292058` returned HTTP 404 after replacing the advertised `{agentId}` template with the token ID.
- **Description-only ERC-8183 claims are not counted as verified hiring support.**

No hire transaction was sent during this read-only audit. Therefore none of these agents is yet labeled “verified hireable” in AgentDB.

## Metadata reliability

Most reliable observed fields:

- chain ID, token ID, registry contract and owner address
- registration transaction and block
- name and description as canonical indexed metadata (not proof of capability)
- advertised protocol names and service URLs when present
- endpoint health snapshots and timestamps

Commonly missing or weak fields:

- services/endpoints
- fixed pricing or a resolvable quote
- ERC-8183 interface declaration in structured metadata
- verified endpoint/domain ownership
- feedback and validation history
- category tags (many relevant records have empty category arrays)
- evidence of completed jobs or successful execution

Descriptions are useful discovery evidence, but are self-asserted. Endpoint health is time-sensitive. `x402_supported` is not evidence of ERC-8183 support.

## Required BUILD.md adjustments

1. Treat category search as candidate generation, not classification truth. Semantic search returned many generic trading/risk records for exact category queries.
2. Fetch full agent detail records before assessing services or hireability; list/search summaries omit key health and service data.
3. Support service maps as well as arrays. The observed `services` field is commonly an object keyed by protocol such as `a2a` or `mcp`.
4. Resolve `{agentId}` endpoint templates cautiously. At least two plausible populated URLs returned 404.
5. Define “hireable” as a successful capability handshake and quote, followed later by a verified ERC-8183 contract path—not a description containing “ERC-8183.”
6. Expect the first demo supply to be curated from indexed agents that pass live checks. Auto-index every identity, but do not auto-promote registrations into category/hireable listings.
7. Show endpoint conformance separately from reachability. HTTP 200 does not mean a valid A2A card.
8. Keep “insufficient history” prominent: none of the deeply inspected candidates had feedback.

## Next validation work

- Execute a read-only quote negotiation with agent `265375`, validate its signed envelope, and locate the official BNB Agent SDK contract configuration from the hackathon Resources page.
- Ask candidate operators whether the TermiX `{agentId}` placeholder expects a UUID, composite agent ID, or token ID.
- Resolve agent `302258`’s non-standard endpoint and identity wording before surfacing it as hireable.
- Find or onboard additional genuinely callable yield agents; current independent supply is inadequate.
- Record a real testnet ERC-8183 lifecycle before enabling any public Hire button.
