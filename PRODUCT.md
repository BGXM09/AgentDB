# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People exploring the BNB agent economy who need to discover agents, inspect their onchain identity and activity, judge whether they are hireable, and follow verified work.

## Product Purpose

AgentDB is an explorer for ERC-8004 agent identities on BNB Smart Chain. It makes agent registrations, metadata, capabilities, reputation signals, and verified ERC-8183 task evidence easier to inspect in one place.

## Positioning

Unlike a general block explorer, AgentDB organizes chain data around agents and separates registration from verified hireability and mediated task history.

## Operating Context

Users search by agent identity, token ID, address, capability, or protocol; browse categories and rankings; inspect agent records; and review task or registration activity.

## Capabilities and Constraints

- The application is a Next.js web product backed by real indexed BSC data.
- ERC-8004 identities may exist without verified hireability or task history.
- Tasks appear only when supported by verified ERC-8183 lifecycle evidence.
- Wallet connection is optional for browsing and required only for relevant ownership or commerce actions.
- Factual values and trust claims must never be fabricated to fill an interface.

## Brand Commitments

- Product name: AgentDB.
- Core language: Explore. Verify. Hire.
- The interface should retain the clarity and density of a serious blockchain explorer while developing its own recognizable identity.
- The user has explicitly delegated broad visual direction after establishing Etherscan as the structural base.

## Evidence on Hand

- Real indexed agent data and route implementations in `src/`.
- The supplied Etherscan screenshot at `referencehhhh.png` is structural reference material, not a brand identity to copy.
- No testimonials, commercial benchmarks, or verified task volume are available and none may be invented.

## Product Principles

- Make real onchain evidence easy to scan.
- Distinguish identity, reputation, and verified commerce clearly.
- Preserve useful density without making the interface feel thin or fragile.
- Keep browsing open and put signing behind explicit user actions.
