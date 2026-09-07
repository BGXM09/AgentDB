import { expect, test } from "@playwright/test";

test("landing explains the product and stacks real tasks before agents", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find your next onchain agent.");
  await expect(page.getByText("Discover AI agents on BNB Chain.", { exact: false })).toBeVisible();
  const task = await page.locator("#latest-tasks").boundingBox();
  const agent = await page.locator("#latest-agents").boundingBox();
  expect(task!.y).toBeLessThan(agent!.y);
  expect(await page.locator("main").innerText()).not.toContain("Latest Tasks / Activity");
  await page.screenshot({ path: "/tmp/agentdb-home-desktop.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("mobile navigation, homepage and profile do not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "/tmp/agentdb-home-mobile.png", fullPage: true });
  await page.goto("/agents/265375");
  await expect(page.getByRole("heading", { name: "Put this agent to work" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "/tmp/agentdb-profile-mobile.png", fullPage: true });
});

test("directory pagination advances, search works, categories load", async ({ page }) => {
  await page.goto("/agents");
  await expect(page.locator(".marketplace-agent-card-link").first()).toBeVisible();
  await page.getByRole("link", { name: "Next", exact: true }).click();
  await expect(page).toHaveURL(/offset=/);
  await expect(page.getByText("Page 2", { exact: true })).toBeVisible();
  await page.goto("/agents?category=grid-trading&offset=10");
  await expect(page.getByRole("heading", { name: "Grid Trading agents" })).toBeVisible();
  await page.goto("/search?q=grid");
  await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
  await expect(page.locator("main")).not.toContainText("temporarily unavailable");
  await page.goto("/search?q=%23265375");
  await page.getByRole("link", { name: /Open Agent #265375/ }).click();
  await expect(page.getByRole("heading", { name: "Put this agent to work" })).toBeVisible();
});

test("agent handoff handles clipboard success and failure", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/agents/265375/hire");
  await expect(page).toHaveURL(/\/agents\/265375#connect$/);
  const button = page.getByRole("button", { name: "Copy endpoint" }).first();
  await button.click();
  await expect(page.getByRole("status")).toContainText("Endpoint copied");
  await page.evaluate(() => { Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: async () => { throw new Error("Denied"); } }); });
  await page.getByRole("button", { name: /Copied|Copy endpoint/ }).first().click();
  await expect(page.getByRole("status")).toContainText("copy it manually");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "/tmp/agentdb-profile-desktop.png", fullPage: true });
});

test("claim explains wallet requirements and supports dismissing the dialog", async ({ page }) => {
  await page.goto("/agents/265375/claim");
  await page.getByRole("button", { name: "Connect owner wallet" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.screenshot({ path: "/tmp/agentdb-claim-desktop.png", fullPage: true });
});

test("placeholder pages are removed and supported routes render real content", async ({ page }) => {
  for (const route of ["/tasks", "/tasks/1", "/internal/agents", "/wallet/altana"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(404);
  }
  await page.goto("/agents/not-an-id");
  await expect(page.getByText("Record not found", { exact: true })).toBeVisible();
  for (const route of ["/activity", "/leaderboard", "/categories/rebalancing", "/categories/health-factor-monitoring", "/categories/yield-optimisation", "/search"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 }), route).toBeVisible();
    const content = page.getByRole("main").filter({ has: page.getByRole("heading", { level: 1 }) });
    await expect(content, route).not.toContainText("Live explorer data is temporarily unavailable");
    await expect(content, route).not.toContainText("Record not found");
  }
});

test("claim and task APIs reject invalid inputs without a wallet or transaction", async ({ request }) => {
  for (const route of ["/api/claims/challenge", "/api/claims/verify", "/api/tasks/record"]) {
    const response = await request.post(route, { data: {} });
    expect(response.status(), route).toBe(400);
  }
});

test("claimed owner can review a service update without sending a transaction", async ({ page }) => {
  const address = "0x1111111111111111111111111111111111111111";
  await page.addInitScript((walletAddress) => {
    Object.defineProperty(window, "ethereum", { value: {
      isMetaMask: true, on() {}, removeListener() {},
      async request({ method }: { method: string }) {
        if (["eth_requestAccounts", "eth_accounts"].includes(method)) return [walletAddress];
        if (method === "eth_chainId") return "0x38";
        if (method === "personal_sign") return `0x${"11".repeat(65)}`;
        if (method === "wallet_requestPermissions") return [{ parentCapability: "eth_accounts" }];
        if (method === "wallet_switchEthereumChain") return null;
        throw new Error(`Unexpected wallet method: ${method}`);
      },
    } });
  }, address);
  await page.route("**/api/claims/challenge", (route) => route.fulfill({ json: { nonce: "ui-test-nonce", message: "Claim agent in isolated UI test" } }));
  await page.route("**/api/claims/verify", (route) => route.fulfill({ json: { claimed: true, agentId: "265375" } }));
  await page.goto("/agents/265375/claim");
  await page.getByRole("button", { name: "Connect owner wallet" }).click();
  await page.getByRole("dialog").getByRole("button", { name: /Connect / }).click();
  await page.getByRole("button", { name: "Verify & claim" }).click();
  await expect(page.getByRole("heading", { name: "Make your agent connectable" })).toBeVisible();
  const original = { type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1", name: "UI test agent", description: "A test service", services: [{ name: "web", endpoint: "https://example.com" }], supportedTrust: ["reputation"] };
  await page.getByLabel("Complete registration JSON").fill(JSON.stringify(original));
  await page.getByLabel("Service endpoint").fill("https://example.com/a2a");
  await page.getByRole("button", { name: "Review registration", exact: true }).click();
  await expect(page.locator(".registration-review pre")).toContainText('"supportedTrust"');
  await expect(page.locator(".registration-review pre")).toContainText("https://example.com/a2a");
  await expect(page.getByRole("button", { name: "Publish on BNB Chain" })).toBeEnabled();
  await page.getByLabel("Service endpoint").fill("http://localhost:8080");
  await expect(page.getByRole("button", { name: "Publish on BNB Chain" })).toHaveCount(0);
  await page.getByRole("button", { name: "Review registration", exact: true }).click();
  await expect(page.locator(".setup-status")).toContainText("public HTTPS");
});
