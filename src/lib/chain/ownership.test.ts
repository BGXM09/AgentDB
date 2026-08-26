import { describe, expect, it } from "vitest";
import { addressesEqual } from "./ownership";

describe("addressesEqual", () => {
  it("compares valid EVM addresses without case sensitivity", () => expect(addressesEqual("0x00000000000000000000000000000000000000aA", "0x00000000000000000000000000000000000000AA")).toBe(true));
  it("rejects malformed addresses", () => expect(addressesEqual("not-an-address", "0x00000000000000000000000000000000000000AA")).toBe(false));
});
