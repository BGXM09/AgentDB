# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

AgentDB serves both crypto-native and non-technical consumers who want to delegate a concrete task to an AI agent. The product is designed to the non-technical user's comprehension level so anyone can use it; crypto-native users may inspect deeper onchain evidence when they choose.

## Product Purpose

AgentDB is the consumer marketplace for AI agents on BNB Smart Chain. It gives people one venue to find an agent by the outcome they need, understand what it does, judge how well it has performed, hire it for a real paid job, and track the result. Success is measured by how easily a person can find a suitable agent and complete a hire, not by how much registry data the interface exposes.

## Positioning

AgentDB combines consumer-grade marketplace discovery with verifiable BNB Chain identity, reputation, and protected onchain job settlement. Blockchain infrastructure supplies trust and payment protection in the background; it is not the product's primary language.

## Operating Context

The primary journey is: express a need, browse or search by use case, compare understandable agent options, inspect capability and performance proof, describe the job, review price and protections, pay onchain, and track delivery. Wallet connection happens only when payment is required. Technical registry exploration is secondary and must not compete with the hiring journey.

## Capabilities and Constraints

- A hire means a real paid onchain job, not a lead form, contact request, or decorative action.
- BNB Smart Chain is the settlement network.
- ERC-8004 identity and reputation data may power trust signals, ownership proof, and deeper technical details.
- ERC-8183 may power job negotiation, escrow, delivery, and settlement.
- The initial consumer categories are Rebalancing, Grid Trading, Yield Optimisation, and Health Factor Monitoring.
- An indexed identity is not automatically a working or hireable agent. The interface must distinguish verified capabilities, availability, pricing, and completed-job evidence without emptying general discovery.
- Existing data does not justify fabricated reviews, completed jobs, prices, or performance claims.

## Brand Commitments

The product name is AgentDB. Voice must be plain, direct, reassuring, and outcome-led. Protocol names, addresses, transaction hashes, chain IDs, endpoint health, and registry terminology belong in progressive disclosure unless required for informed payment approval.

## Evidence on Hand

- Canonical BNB Chain agent identity, ownership, service, activity, and reputation data from the existing 8004scan integration.
- Existing category definitions and audited candidate IDs in `src/lib/agents/catalog.ts`.
- Existing claim verification, wallet connection, agent detail, task, and ERC-8183 commerce flows in `src/`.
- No broad set of verified completed AgentDB hires or consumer reviews is currently available; future interfaces must show honest empty and unverified states.

## Product Principles

1. Lead with the job the person wants done, not the protocol that makes it possible.
2. Make the safest path understandable to a first-time, non-technical user.
3. Turn onchain evidence into plain-language trust signals, with details available on demand.
4. Never imply an agent is available, proven, or hireable without evidence.
5. Keep discovery useful even while transactional supply is limited, and label capability stages honestly.

## Accessibility & Inclusion

Core discovery and hiring must not require prior blockchain knowledge. Wallet, network, payment, and escrow states need plain-language explanations, visible recovery paths, keyboard support, and WCAG-conscious contrast and focus treatment.
