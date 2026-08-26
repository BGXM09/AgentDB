# AgentDB — BUILD.md

## 0. Mission

Build **AgentDB**, an explorer-first marketplace for autonomous agents on BNB Smart Chain.

AgentDB should feel like a **chain explorer for the agent economy**, not a generic SaaS marketplace.

Core thesis:

> **Etherscan/BscScan helps users understand what happened onchain. AgentDB helps users understand what agents are doing onchain, whether they can be trusted, and lets users hire them.**

Primary product loop:

> **Discover → Verify → Compare → Hire → Track → Review**

Primary tagline:

> **Explore. Verify. Hire.**

The product must be useful without a wallet. Wallet connection is required only for actions such as hiring, claiming an agent, creating permissions, revoking access, or leaving a verified review.

---


# 0A. Mandatory Environment Setup — Do This Before Any Implementation

After reading this BUILD.md completely, **do not start implementing the application yet**.

Your first action must be to perform environment setup by asking the user interactively for the required credentials/secrets **one at a time**:

1. `SCAN8004_API_KEY`
2. `BSC_MAINNET_RPC_URL`
3. `BSC_TESTNET_RPC_URL`
4. `NEXT_PUBLIC_SUPABASE_URL`
5. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. `SUPABASE_SERVICE_ROLE_KEY`
7. `DEV_WALLET_PRIVATE_KEY`

For every value the user provides:

- Write it directly into `.env.local`.
- Never repeat, quote, summarize, print, log, or echo the value back to the user.
- Never include secret values in terminal output.
- Never commit `.env.local`.
- Ensure `.env.local` is covered by `.gitignore`.
- Never expose server-only secrets through `NEXT_PUBLIC_*` variables.
- Never copy secret values into documentation, BUILD.md, README files, source code, tests, logs, or `.env.example`.
- `.env.example` must contain variable names with empty values only.
- Treat `DEV_WALLET_PRIVATE_KEY` as a disposable development wallet.
- Never expose the private key to client-side code.
- Default blockchain writes to BSC Testnet until the relevant workflow has been verified.

Where the environment supports hidden/non-echoing terminal input, use it for sensitive values, especially `DEV_WALLET_PRIVATE_KEY` and `SUPABASE_SERVICE_ROLE_KEY`, instead of requiring the user to expose those values in ordinary chat output.

After collecting the credentials, validate each integration without revealing any credential.

Report only safe statuses such as:

```text
8004scan: Connected
BSC Mainnet RPC: Connected
BSC Testnet RPC: Connected
Supabase: Connected
Development Wallet: Loaded — address 0x...
```

It is acceptable to derive and display the development wallet's **public address**, but never its private key.

If a credential fails validation, identify only the integration that failed and ask the user to replace that credential. Never display the failed value.

Once environment validation passes, begin **Phase 1** of this BUILD.md.

Do not proceed to the full application before completing the real-agent supply audit required by this specification.

---

# 1. Hackathon Goal

AgentDB is being built for the BNB Chain Smart Money Era hackathon, Main Track: **Build the BNB Agent Studio Marketplace**.

The marketplace must:

- Surface real BSC agent data.
- Let users discover agents.
- Help users understand what agents do.
- Let users activate/hire agents in a few clicks.
- Treat all four required categories as first-class:
  1. Rebalancing
  2. Grid Trading
  3. Yield Optimisation
  4. Health Factor Monitoring
- Use real onchain data and real transactions.
- Prefer mainnet for the final demo where possible.
- Support testnet during development.
- Expose user-facing permission controls where supported.
- Avoid fake metrics and fake activity in production mode.

Do **not** build a new agent-building platform.

BNB Agent Studio owns agent creation/deployment.

AgentDB owns:

- discovery
- verification
- comparison
- hiring
- permissions visibility
- job tracking
- activity exploration
- reviews
- benchmark evidence

---

# 2. Product Scope — V1

AgentDB has **10 core functions**.

## 2.1 Agent Discovery

Index ERC-8004 agents on BSC and let users browse/search them.

Users should be able to search by:

- agent name
- ERC-8004 agent ID
- owner/address
- capability
- category
- protocol
- service
- endpoint type
- keywords
- natural-language intent where supported by 8004scan semantic search

Examples:

- `#21843`
- `0x72...91A`
- `yield`
- `grid trading`
- `best low risk USDT yield agent`

---

## 2.2 Agent Explorer

Every indexed ERC-8004 agent gets an explorer-style page.

Core sections:

- identity
- agent ID
- owner
- wallet/address
- description
- capabilities
- services/endpoints
- registration details
- reputation
- feedback
- supported protocols
- activity
- hireability status
- pricing/quote availability
- relevant technical metadata

The design should resemble a blockchain explorer page, not a marketplace card page.

---

## 2.3 Agent Search

One universal search box should resolve:

- agent names
- ERC-8004 IDs
- addresses
- capabilities
- categories
- protocols
- natural-language discovery queries

Search should be one of the primary interactions on the homepage.

---

## 2.4 Agent Comparison & Ranking

Allow users to compare agents using meaningful signals such as:

- AgentDB Score
- confidence
- verified job outcomes
- ERC-8004 reputation
- completed AgentDB jobs
- success rate
- activity recency
- supported protocols
- pricing
- verified reviews
- endpoint health
- hireability

Do not create meaningless rankings based only on profile popularity.

---

## 2.5 AgentDB Score

Create an explainable trust/performance score.

Initial structure:

- **Execution — 40%**
  - verified AgentDB-mediated job outcomes
  - success/failure rate
  - completed jobs
- **Reputation — 25%**
  - ERC-8004 reputation and feedback
  - verified feedback weighted more heavily than unverified feedback
- **Reliability — 20%**
  - endpoint health
  - recent activity
  - responsiveness
  - failed/rejected jobs
- **Identity & Transparency — 15%**
  - valid ERC-8004 identity
  - metadata completeness
  - declared services
  - working endpoints
  - ownership clarity

Every score MUST include a confidence label.

Examples:

- `96 / 100 · High confidence`
- `82 / 100 · Medium confidence`
- `Insufficient history`

Never pretend low-data agents have a precise score.

Clicking the score must show the breakdown and evidence.

---

## 2.6 Service Discovery & Quotes

Agent pages should clearly explain:

- what the agent does
- supported services
- supported protocols
- required inputs
- indicative pricing if available
- quote availability
- hireability

Do not assume ERC-8004 provides a universal Fiverr-style service catalogue.

AgentDB should normalize existing metadata where possible.

For hireable agents, AgentDB should request/resolve actual job terms before the user signs anything.

---

## 2.7 Agent Hiring

This is the **centerpiece of AgentDB**.

Primary V1 hiring rail:

> **ERC-8183**

Do not assume x402 is the default hiring protocol.

x402/B402 may be supported later as an adapter where a real indexed service requires it, but ERC-8183 is the primary job/escrow workflow for AgentDB V1.

Hiring UX:

1. Select service
2. Configure task
3. Request/get quote
4. Review terms
5. Review permissions if needed
6. Hire/sign/fund
7. Redirect to Task Explorer
8. Track execution
9. Settle/complete
10. Review

Wallet stack:

- wagmi
- viem

Do not require WalletConnect/Reown unless later needed.

---

## 2.8 Permission Management

Where an agent supports delegated/scoped permissions, show them clearly.

Support Altana integration where compatible.

Display:

- allowed contracts
- allowed methods/actions
- spend cap
- asset limits
- expiry
- session status
- transactions performed under the session

Primary action:

> **Revoke Access**

Do not pretend every indexed agent supports Altana.

Use a capability badge such as:

> `Altana Protected ✓`

when actually supported.

---

## 2.9 Task Explorer

An AgentDB **Task** is a first-class explorer object.

A task is not the same thing as a transaction.

One agent job may produce multiple blockchain transactions.

A Task page should show:

- task ID
- agent
- client
- service
- quoted price/budget
- capital involved where relevant
- created time
- status
- lifecycle
- output/result
- settlement
- related reviews
- all underlying BSC transaction hashes

Example lifecycle:

- Requested
- Quoted
- Funded
- Accepted
- Executing
- Submitted
- Settled
- Completed

Also support:

- Rejected
- Failed
- Disputed
- Expired
- Refunded

Do not invent a custom dispute protocol when ERC-8183 already provides lifecycle/settlement primitives.

---

## 2.10 Agent Activity / Economy Explorer

Build an explorer view for agent activity on BNB Chain.

Instead of raw chain activity such as:

`0x123 called 0x456 using method 0x...`

AgentDB should translate it into human-readable agent activity when attribution is known:

> `YieldPilot deposited 1,000 USDT into Venus as part of Task #829184.`

Core explorer tables:

- Latest Agent Activity
- Latest Tasks
- Newly Registered Agents
- Top Agents
- Most Active Agents
- Protocol Activity
- Category Activity

Every semantic activity item should link to:

- agent
- task
- protocol
- underlying BSC transaction

AgentDB does not replace BscScan.

Always offer:

> `View raw transaction on BscScan ↗`

---

# 3. Explicit V1 Exclusions

Do NOT build these unless specifically instructed later:

- agent creation
- agent deployment
- BNB Agent Studio replacement
- Studios/developer organization pages
- social feeds
- chat/community features
- token launches
- copy trading infrastructure from scratch
- custom blockchain indexer
- custom marketplace smart contracts
- custom dispute system
- custom agent runtime
- fake agents
- fake onchain transactions
- fake reputation
- fake production activity
- giant analytics suite unrelated to marketplace decisions

Keep V1 focused.

---

# 4. Data Architecture

## 4.1 Canonical Sources

### 8004scan

Primary source for indexed ERC-8004 agent discovery data.

Use it for:

- identity
- capability
- ownership
- reputation
- feedback
- network data
- semantic discovery where available

AgentDB may cache/index these records for speed and product-specific queries.

Do not treat the AgentDB database as canonical for ERC-8004 identity.

### BNB Chain

Canonical source for:

- ERC-8004 registration state
- ERC-8183 jobs
- settlement
- transaction hashes
- wallet state
- permission/session transactions
- other contract-level proof

### Agent endpoints

Use advertised service endpoints to resolve:

- services
- quotes
- task configuration
- execution interfaces
- agent responses
- supported protocols where declared

Never invent service details that an agent does not expose.

---

# 5. AgentDB-Owned Data

Use a lightweight application database such as Supabase.

Supabase is NOT the source of truth for onchain identity.

It stores AgentDB-specific product data, such as:

- normalized cached agent records
- computed AgentDB Scores
- score evidence snapshots
- verified AgentDB reviews
- claim records
- AgentDB-specific metadata enhancements
- hireability checks
- benchmark / Advantage Report results
- in-app notifications
- user preferences
- task annotations
- search/indexing helpers
- endpoint health checks

Design the schema so canonical onchain fields are clearly separated from AgentDB-owned fields.

---

# 6. Canonical vs AgentDB Metadata

Every agent page must distinguish two data classes.

## Canonical

Read from ERC-8004 / chain / indexed sources.

Examples:

- agent ID
- owner
- registration tx
- canonical metadata URI
- canonical name/description where present
- endpoints
- reputation/feedback
- network

## AgentDB Enrichment

Added after a verified owner claims an agent.

Examples:

- AgentDB category
- human-friendly service explanation
- pricing presentation
- additional docs URL
- service grouping
- preferred display image
- AgentDB-specific onboarding metadata
- hireability configuration

Never silently overwrite canonical data with AgentDB enrichment.

---

# 7. Auto-Indexing + Claim Agent

This is a core AgentDB product principle.

> Every ERC-8004 agent on BSC should be discoverable automatically.

No manual listing application should be required for basic indexing.

Flow:

1. Agent registers via ERC-8004.
2. 8004scan indexes it.
3. AgentDB ingests it.
4. Agent appears automatically.
5. Page may initially show incomplete/hireability warnings.

Example:

- Identity ✓
- Description ✓
- Service Endpoint ✓
- Reputation —
- Pricing —
- Hiring Integration —
- Hireable ✕

Then expose:

> **CLAIM THIS AGENT**

Claim flow:

1. User connects wallet via wagmi.
2. AgentDB verifies that wallet controls/owns the ERC-8004 identity.
3. User signs ownership proof.
4. Claim is recorded.
5. Owner gains access to AgentDB-specific enrichment fields.

Do not provide control to wallets that cannot prove ownership.

---

# 8. Make Your Agent Hireable

After claiming an agent, offer:

> **ENABLE HIRING**

Perform automated checks.

Potential checks:

- ERC-8004 identity valid
- service endpoint reachable
- ERC-8183 interface detected
- quote/service info available
- pricing resolvable
- required metadata present

Output:

> `Hireable ✓`

or:

> `Not currently hireable`

with exact reasons.

Examples:

- Missing service endpoint
- ERC-8183 interface not detected
- Quote endpoint unreachable
- Required service metadata missing

Registered does NOT mean hireable.

AgentDB must make this distinction clear.

---

# 9. Hiring UX Specification

For V0, the hiring experience must remain visually consistent with the BscScan baseline. Preserve the explorer design language even in hiring screens. After the initial BscScan-faithful implementation is deployed, hiring UX may be tastified and simplified through explicit iteration.

## Step 1 — Select Service

Example:

- Yield Optimisation
- Position Protection
- Grid Strategy
- LP Rebalance

Use only services actually supported by that agent.

## Step 2 — Configure

Inputs vary by agent.

Examples:

- asset
- amount
- protocol
- risk
- duration
- position
- strategy range
- target
- spend cap

Do not hardcode one universal schema for every agent.

## Step 3 — Quote

Resolve:

- agent fee
- budget
- estimated gas where possible
- duration
- expected deliverable
- payment token
- settlement mechanism

No transaction should occur yet.

## Step 4 — Permissions

When required, show plain-language permission summary.

Example:

- Can interact with Venus
- Can add collateral
- Cannot transfer to arbitrary wallets
- Max spend: 100 USDT
- Expires: September 1, 2026

## Step 5 — Review

Show:

- agent identity
- task
- parameters
- fee
- capital involved
- permission scope
- expiry
- settlement mechanism
- risks

## Step 6 — Hire

Create/fund the ERC-8183 job.

## Step 7 — Redirect

Immediately route to:

> **Task #<id>**

The hiring experience should never end at a generic success toast.

---

# 10. ERC-8183

Use the official BNB Agent SDK / official supported implementation wherever possible.

ERC-8183 is the primary V1 commerce layer.

Relevant concepts:

- create job
- budget
- fund
- submit
- settle
- dispute
- reject
- claim refund
- evaluator/router/policy

Do NOT write a replacement escrow contract.

Do NOT create proprietary job settlement logic unless absolutely required.

ERC-8004 and ERC-8183 are independent standards.

AgentDB product rule for V1:

> Full canonical marketplace listings should be ERC-8004 identities. Hiring can be enabled when a compatible ERC-8183 service/interface is available.

---

# 11. x402 / B402

Do not make x402 the default Hire Agent flow.

BNB Agent Studio currently positions:

- ERC-8004 = identity
- ERC-8183 = task/job commerce
- x402 = service/API/LLM/data payments and agent operating payments

However, architect commerce as an interface so future adapters are possible.

Suggested abstraction:

```ts
interface CommerceAdapter {
  detect(agent): Promise<boolean>
  getQuote(input): Promise<Quote>
  execute(input): Promise<ExecutionResult>
  getStatus(id): Promise<JobStatus>
}
```

Initial adapter:

- `ERC8183CommerceAdapter`

Potential future adapters:

- `X402CommerceAdapter`
- `B402CommerceAdapter`

Do not implement unused adapters prematurely.

---

# 12. Altana

Integrate Altana only where it adds real permission/session functionality.

Use cases:

- scoped call allowlists
- spend caps
- session expiry
- onchain permission registration
- revocation
- real agent transactions under scoped permissions

User-facing requirements:

- permissions must be visible
- users must be able to revoke them from AgentDB
- status must be clear
- transaction proof must be linkable

Testnet counts for the hackathon, but mainnet is stronger.

Do not “feed agents into Altana” as a database operation.

Altana is used in the permission/session/hiring execution layer.

---

# 13. Reviews

Create two separate reputation surfaces.

## Verified AgentDB Reviews

Only allow a wallet to submit a verified review when AgentDB can prove that wallet completed an AgentDB-mediated job with that agent.

A verified review must link to:

- wallet
- task ID
- agent
- outcome
- review

Badge:

> `Verified Hire ✓`

## ERC-8004 Feedback

Display broader indexed ERC-8004 feedback separately.

Do not present all ERC-8004 feedback as verified AgentDB reviews.

When scoring reputation, verified hire feedback should carry more weight.

---

# 14. Agent Advantage / Benchmarks

Turn the required Agent Advantage Report into a product feature.

Agent page tab:

> **Benchmarks**

Compare:

> Manual workflow vs AgentDB-hired agent

Track:

- time
- cost
- output quality
- actual output/evidence
- relevant transaction/task
- methodology

At least three real benchmark tasks should eventually be recorded.

At least one must cover:

- trading
- stocks/equities
- or security

Suggested BNB-focused benchmark categories:

1. Trading / Grid strategy
2. Yield discovery/optimisation
3. Lending health-factor monitoring

Do not fabricate benchmark outcomes.

Each benchmark should link to real evidence.

---

# 15. Notifications

V1:

- in-app notification center
- optional email later

Important notification types:

- agent accepted job
- agent rejected job
- quote received
- transaction executed
- action requires approval
- job failed
- job completed
- dispute opened
- refund available
- permission approaching expiry
- permission revoked

Do not build Telegram/Discord/SMS integrations in V1.

---

# 16. Network Strategy

Support both BSC networks.

## Development

Default to:

> **BSC Testnet — Chain ID 97**

Use it for:

- wallet flows
- contract integration
- ERC-8183 testing
- Altana session testing
- development transactions

## Production / Final Demo

Prefer:

> **BSC Mainnet — Chain ID 56**

for:

- real indexed agents
- real hires
- real payments
- real task activity
- real reviews
- real transaction hashes

Mainnet is the default public experience where viable.

No simulated production transactions.

A network selector may exist for development/testing, but do not make the final product feel like a testnet demo.

---

# 17. Wallet Stack

Use:

- `wagmi`
- `viem`

Support injected EVM wallets first.

Do not introduce WalletConnect/Reown unless required later.

Requirements:

- BSC Mainnet
- BSC Testnet
- chain switching
- wallet address display
- signing
- transaction status
- ownership verification
- contract writes
- readable error states

Never store user private keys.

---

# 18. RPC

Support configurable RPC URLs via environment variables.

Example:

```env
BSC_MAINNET_RPC_URL=
BSC_TESTNET_RPC_URL=
```

Use a dedicated BSC-capable RPC provider if available.

Do not hardcode secrets.

---

# 19. 8004scan Integration

Use an environment variable:

```env
SCAN8004_API_KEY=
```

Current development must work even before Pro-tier approval.

Build a provider/service abstraction so rate limits can be handled gracefully.

Implement:

- caching
- pagination
- retry/backoff
- clear API errors
- stale-data handling
- normalization

Do not block development waiting for Pro approval.

---

# 20. Internal Data Inspector

Build a private/internal inspection route early.

Suggested route:

> `/internal/agents`

Purpose:

Inspect raw 8004scan and derived AgentDB records before polishing UI.

Show:

- raw canonical record
- normalized record
- endpoints
- capability metadata
- reputation
- feedback
- detected category
- detected commerce interface
- endpoint health
- hireability result
- AgentDB Score inputs

This page is for development only.

It should help expose wrong assumptions about real agent metadata early.

---

# 21. Required Category Supply Audit

This is an early engineering milestone, not an afterthought.

Use the 8004scan API to identify multiple real BSC candidates for:

1. Rebalancing
2. Grid Trading
3. Yield Optimisation
4. Health Factor Monitoring

For each candidate capture:

- ERC-8004 ID
- name
- description
- owner
- network
- endpoints
- commerce capability
- service metadata
- pricing
- reputation
- activity
- whether callable
- whether ERC-8183-hireable
- whether mainnet or testnet
- confidence that the category is correct

Do NOT fake category supply.

If one category has poor supply, surface that fact immediately.

---

# 22. Explorer Information Architecture

Primary navigation should be compact.

Recommended:

- Home
- Agents
- Tasks
- Activity
- Leaderboard

Optional:

- Benchmarks
- My Activity
- Notifications

Do NOT add Studios in V1.

BNB Agent Studio handles the developer/creation side.

---

# 23. Homepage

Full explorer aesthetic.

Primary elements:

## Header

- AgentDB wordmark
- network indicator
- nav
- wallet button

## Universal Search

Large, prominent search input.

Placeholder:

> `Search by agent, ERC-8004 ID, address, capability or protocol`

## Network Metrics

Only show metrics we can derive honestly.

Examples:

- Indexed Agents
- Active/Hireable Agents
- Agent Tasks
- Agent Activity

Do not show fake volume.

## Explorer Panels

Examples:

- Latest Tasks
- Latest Agents
- Latest Agent Activity
- Top Agents

## Required Categories

All four must be visually first-class.

- Rebalancing
- Grid Trading
- Yield Optimisation
- Health Factor Monitoring

---

# 24. Agent List UI

Do not default to giant marketplace cards.

Use explorer-style tables.

Example columns:

- ID
- Agent
- Category
- AgentDB Score
- Confidence
- Jobs
- Reputation
- Hireability
- Last Active

Filters:

- category
- protocol
- score
- confidence
- hireability
- network
- endpoint type
- activity

Sorting:

- recommended
- score
- most active
- most hired
- newest

---

# 25. Agent Page UI

Explorer-first.

Suggested header:

- agent name
- verification/identity status
- ERC-8004 ID
- address
- category
- AgentDB Score
- confidence
- Hire Agent CTA

Tabs:

- Overview
- Services
- Tasks
- Activity
- Performance
- Reviews
- Benchmarks
- Technical

Technical tab:

- canonical identity
- owner
- registration transaction
- metadata URI
- endpoints
- interface detection
- contract information
- raw protocol data where useful

Do not drown ordinary users in technical information on the Overview tab.

---

# 26. Task Page UI

Treat this like an Etherscan transaction page plus human-readable lifecycle.

Header:

- Task ID
- status
- agent
- client
- service

Summary:

- budget
- payment token
- created
- duration
- settlement state

Lifecycle:

- Requested
- Quoted
- Funded
- Accepted
- Executing
- Submitted
- Settled

Underlying transactions:

- tx hash
- action
- protocol
- value
- status
- timestamp
- BscScan link

Result:

- human-readable outcome
- raw output where appropriate
- evidence link
- review state

---

# 27. Activity Semantics

Never pretend to know why a transaction occurred unless evidence supports the interpretation.

There are three levels:

## Level A — Confirmed semantic task event

AgentDB knows the task and associated transaction.

Display:

> `YieldPilot deposited 1,000 USDT into Venus for Task #829184.`

## Level B — Known agent transaction, uncertain business context

Display:

> `YieldPilot interacted with Venus.`

## Level C — Raw transaction only

Display raw transaction information and link to BscScan.

Accuracy is more important than flashy narration.

---

# 28. Visual Design Direction — STRICT BscScan V0

For the initial implementation, **reproduce the current BscScan explorer UI as closely as practical, head-to-toe.**

Reference: `https://bscscan.com/`

This is NOT merely "BscScan-inspired", an explorer-style interpretation, or an opportunity to modernize the design. **V0 should deliberately look and behave recognizably like BscScan.** We will iterate and add AgentDB-specific taste only after this baseline is deployed and reviewed.

Match BscScan's current visual and structural language as closely as practical, including:

- overall page density and max-width behavior
- top navigation proportions and hierarchy
- network/navigation controls
- homepage hero/search placement and scale
- compact network/stat cards
- two-column homepage explorer panels
- card structure and border treatment
- typography hierarchy and compact text sizing
- spacing rhythm and row heights
- table density, headers, alignment and hover behavior
- tabs and detail-page section structure
- pagination
- dropdowns
- badges and status treatments
- timestamps and metadata presentation
- monospace/truncated addresses and IDs with copy affordances
- detail pages patterned after BscScan transaction/address/token-style pages
- responsive/mobile behavior
- light/dark behavior where applicable

Map BscScan's explorer objects to AgentDB objects rather than redesigning the shell:

- Latest Blocks → Latest Agents
- Latest Transactions → Latest Tasks / Agent Activity
- Transactions → Tasks
- Tokens → Agents
- Transaction Details → Task Details
- Token/Address-style detail pages → Agent detail pages
- Address activity → Agent activity

Use AgentDB branding, copy, icons, data, and domain-specific semantics. **Do not copy BscScan logos, trademarks, copyrighted illustrations, or proprietary brand assets.** The instruction is to reproduce the UI system/layout baseline, not their branding.

Do NOT "improve" the BscScan baseline during V0. In particular, do not introduce:

- generic SaaS landing-page sections
- oversized rounded cards
- excessive whitespace
- glassmorphism
- gradients for decoration
- glowing AI effects
- robot/AI mascots
- giant marketing headlines
- card-grid marketplace aesthetics
- unsolicited visual redesigns

If there is uncertainty about a layout decision, **default to how BscScan currently handles the equivalent explorer screen.**

Even the Hire Agent flow should initially remain visually consistent with the BscScan baseline. Do not introduce a separate fintech design language in V0. Once the BscScan-equivalent baseline is working and deployed, AgentDB-specific UX improvements will be introduced iteratively by explicit instruction.

V0 principle:

> **BscScan first. AgentDB data. Taste later.**

Use explorer design for:

- discovery
- due diligence
- task/activity investigation

Use cleaner fintech-style UI for:

- hiring
- permissions
- signing
- confirmation

Movie/IMDb inspiration should remain subtle.

Brand:

> **AgentDB**

Possible semantic references:

- Credits = completed work/history
- AgentDB = IMDb-style database metaphor

Do not make the interface look like Netflix.

---

# 29. Responsive Design

Desktop-first explorer layout, but fully responsive.

On mobile:

- tables may become compact row cards
- addresses truncate with copy action
- hiring uses full-screen sheet
- filters collapse into drawer
- universal search remains prominent

Do not simply hide major functionality on mobile.

---

# 30. Error / Empty States

Must explicitly handle:

- agent metadata missing
- no description
- no reputation
- no reviews
- no service endpoint
- endpoint offline
- not hireable
- unsupported network
- quote failure
- wallet rejected signature
- transaction reverted
- wrong network
- insufficient balance
- job rejected
- job disputed
- refund available
- insufficient scoring history

Use clear language.

Examples:

> `No verified hiring interface detected.`

> `Insufficient history to calculate a reliable AgentDB Score.`

Never fill missing data with invented values.

---

# 31. Security Rules

- Never request or store user private keys.
- Never put secrets in frontend bundles.
- Never commit `.env`.
- Validate network before contract calls.
- Verify ownership onchain for claims.
- Sanitize external metadata.
- Treat external URLs/endpoints as untrusted.
- Validate contract addresses.
- Avoid arbitrary contract calls from user-controlled metadata.
- Apply allowlists/validation before generating delegated permissions.
- Clearly show spending limits before signatures.
- Prefer read-only experience before wallet connection.

---

# 32. Suggested Stack

Frontend:

- Next.js
- TypeScript
- React
- wagmi
- viem

Styling:

- Tailwind CSS or a small controlled design system
- avoid importing a giant UI kit unless it materially speeds development

Backend:

- Next.js server routes/actions for lightweight application logic
- Supabase/Postgres for AgentDB-owned data

Chain:

- BSC Mainnet
- BSC Testnet

Agent discovery:

- 8004scan Developer API

Commerce:

- ERC-8183 via official BNB Agent SDK / supported contracts

Permissions:

- Altana where applicable

Explorer links:

- BscScan

Deployment:

- Vercel

---

# 33. Environment Variables

Create `.env.example`.

Suggested initial variables:

```env
# 8004scan
SCAN8004_API_KEY=

# BSC RPC
BSC_MAINNET_RPC_URL=
BSC_TESTNET_RPC_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_DEFAULT_CHAIN_ID=56

# Optional notifications later
RESEND_API_KEY=
```

Do not require a server-side wallet private key for normal marketplace operation unless a specific integration truly requires one.

If a development wallet is necessary for controlled server-side integration testing, isolate it and never expose it to the frontend.

---

# 34. Development Order

Do NOT attempt to build everything at once.

## Phase 1 — Reality Check / Data

1. Scaffold app.
2. Configure BSC chains.
3. Integrate 8004scan.
4. Build `/internal/agents`.
5. Inspect real agent records.
6. Audit all four required categories.
7. Detect real services/endpoints.
8. Identify real ERC-8183-hireable agents.
9. Document missing-data patterns.

Do not proceed based on guessed schemas.

## Phase 2 — Explorer Core

1. Homepage.
2. Universal search.
3. Agent list.
4. Agent page.
5. category pages.
6. basic AgentDB Score.
7. activity explorer.
8. task page shell.

Use real data.

## Phase 3 — Wallet + Ownership

1. wagmi/viem.
2. BSC switching.
3. Claim Agent.
4. ownership verification.
5. enrichment UI.
6. hireability checker.

## Phase 4 — Hiring

1. ERC-8183 integration.
2. service config.
3. quote flow.
4. review flow.
5. fund/create job.
6. task state tracking.
7. settlement/failure states.

This phase receives priority over decorative UI work.

## Phase 5 — Permissions

1. Altana session integration.
2. permission summary.
3. spend cap.
4. expiry.
5. revoke.
6. transaction attribution.

## Phase 6 — Trust

1. verified reviews.
2. score refinement.
3. score confidence.
4. benchmarks.
5. Agent Advantage evidence.

## Phase 7 — Polish

1. responsive behavior.
2. loading states.
3. empty states.
4. error states.
5. animations only where useful.
6. performance.
7. accessibility.
8. mainnet demo hardening.

---

# 35. Codex Working Rules

When implementing:

1. **Inspect before assuming.**
2. Use official/current BNB docs and SDKs.
3. Do not invent undocumented API fields.
4. Do not fake agent capabilities.
5. Do not fake pricing.
6. Do not fake transaction data.
7. Do not create placeholder agents in production views.
8. Keep external integrations behind provider/adaptor interfaces.
9. Keep canonical data separate from AgentDB enrichment.
10. Prefer simple architecture over microservices.
11. Avoid unnecessary smart contracts.
12. Avoid unnecessary dependencies.
13. Keep the build continuously runnable.
14. Add basic tests for parsing, scoring, ownership verification, and commerce adapter logic.
15. Preserve the explorer visual direction.
16. Prioritize hiring reliability over cosmetic effects.
17. Do not add Studios.
18. Do not build agents unless later explicitly instructed.
19. Treat mainnet as the final target and testnet as the integration environment.
20. Surface uncertainty instead of hiding it.

---

# 36. First Deliverable Expected From Codex

Before building the full UI, produce a working discovery/data proof.

Expected output:

1. Running Next.js AgentDB app.
2. 8004scan integration.
3. `/internal/agents` inspector.
4. Paginated real BSC agent retrieval.
5. Search.
6. Normalized agent model.
7. Initial category classifier.
8. Endpoint/service inspection.
9. Hireability detection attempt.
10. Report in repo:

`docs/SUPPLY-AUDIT.md`

The report must answer:

- How many useful BSC agents were inspected?
- Which real agents fit each mandatory category?
- Which metadata fields are reliable?
- Which fields are commonly missing?
- Which agents expose ERC-8183?
- Which appear actually callable?
- Which expose pricing?
- Which category has the weakest supply?
- What assumptions in BUILD.md need adjustment based on real data?

Do not hide bad findings.

This audit determines the rest of the implementation.

---

# 37. Success Condition

AgentDB is successful when a first-time user can:

1. Open AgentDB without connecting a wallet.
2. Search/browse real BSC agents.
3. Understand what an agent does.
4. Inspect its identity and reputation.
5. Understand whether it is hireable.
6. Compare it with alternatives.
7. Connect a wallet.
8. Configure a real job.
9. See the actual quote and permissions.
10. Hire the agent.
11. Watch the resulting task and BSC transactions.
12. Revoke permissions when applicable.
13. Review the completed job.
14. Understand whether using the agent was actually advantageous.

The final product should make this sentence true:

> **AgentDB is the canonical explorer, trust layer, and hiring interface for the BNB agent economy.**
