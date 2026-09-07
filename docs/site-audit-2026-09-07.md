# Site audit and endpoint-first hiring

## Result

The homepage explains discovery, evidence, and direct service connections. Its full-width Latest tasks section precedes Latest agents. The existing monochrome identity and category artwork are retained. Mobile navigation is visible, and the homepage no longer runs dozens of category searches just to populate counts.

Agent profiles now have one connection handoff instead of repeated price, delivery, review, and checkout panels. Published endpoints can be copied, selected manually when clipboard access fails, or opened. Old `/agents/:id/hire` URLs redirect to the profile's connection section for any agent.

## Removed pages

- `/tasks`: live Supabase queries confirm that `public.marketplace_tasks` is absent from the schema cache. Its former empty state hid this storage failure. The landing section says task tracking is not available yet.
- `/tasks/:id`: displayed the same unindexed placeholder for every ID.
- `/internal/agents`: exposed an internal development inspector as a public route.
- `/wallet/altana`: experimental buyer-wallet setup tied to the retired checkout.

The associated navigation links and hard-coded checkout component were removed. Deleted tracked source files remain recoverable through Git. Task recording utilities and the existing migration remain available for a future completed tracking integration.

## Owner setup

Owners connect their wallet, prove current ownership, and sign a claim challenge. After verification, the service editor can load the current registration or accept the owner's complete registration JSON, add/update an A2A, MCP, or web endpoint, and show the full proposed document before publication.

Publishing rechecks `ownerOf`, simulates `setAgentURI`, asks the owner wallet to submit, and waits for a successful receipt. Existing fields and other services are preserved. Publishing a data URI changes the agent's complete registration and costs gas; the UI explains this before submission. A submitted transaction cannot accidentally be resubmitted while confirmation is uncertain.

This publishes connection information using [ERC-8004 registration](https://eips.ethereum.org/EIPS/eip-8004). It does not deploy the provider's service or create payment support. A provider offering [ERC-8183 commerce](https://eips.ethereum.org/EIPS/eip-8183) must implement that service and publish its terms. Indexer refresh is required before new registration data appears in AgentDB.

## Functional fixes

- Current-owner comparison prevents old claims from appearing valid after an indexed ownership change.
- Claim challenges are consumed atomically; successful reclaims clear revocation.
- Task-record submissions must match the agent's registered provider wallet.
- Service detection ignores unrelated metadata images, documentation, protocol-only declarations, credentials, and local-network URLs.
- Category pagination respects offsets and end states; category pages link to additional results.
- Missing agents and unavailable upstream data are distinguished.
- Upstream requests and Supabase calls have timeouts; category queries retain successful partial results.
- Short searches use the provider's documented indexed search. Longer queries fall back from semantic search to indexed search. During the audit, semantic `q=grid` returned HTTP 500 `DATABASE_ERROR`, while indexed `search=grid` returned HTTP 200 and 27 matches. See [provider API documentation](https://8004scan.io/developers).
- PostCSS is overridden to a patched compatible version; installation reports zero known vulnerabilities.
- `npm run lint` now performs TypeScript checking instead of calling the unsupported `next lint` command.

## Verification

- `npm test`: endpoint filtering, registration preservation/encoding/validation, search fallback, identity errors, and the existing classification/commerce tests.
- `npm run build`: production compilation, TypeScript checks, and route generation.
- `npm run test:e2e`: live discovery routes, removed routes, pagination, search, desktop/mobile overflow, endpoint clipboard behavior, claim dialog, invalid API inputs, and an isolated mocked-wallet claim/setup review.
- Read-only integration checks: claim tables are available; task storage is missing; live agent registrations load.

The browser owner test mocks its wallet and claim responses. No real claim was persisted and no real registration transaction or payment was submitted. Live wallet signing, transaction fees, third-party endpoint uptime, and provider delivery are not certified by these tests.

To run browser tests, start the site on port 3100, install Chromium with `npx playwright install chromium`, then run `npm run test:e2e`. The browser base URL can be overridden with `PLAYWRIGHT_BASE_URL`.
