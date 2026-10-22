import { describe, expect, it } from "vitest";
import { BALANCE_CONFIG } from "@/pages/Profile";

describe("Plus profile balances", () => {
  it("includes 30 vibes", () => {
    expect(BALANCE_CONFIG.plus.tiles.find(tile => tile.key === "vibes")?.count).toBe(30);
  });
  it("includes 5 invites", () => {
    expect(BALANCE_CONFIG.plus.tiles.find(tile => tile.key === "invites")?.count).toBe(5);
  });
  it("includes 5 magic searches", () => {
    expect(BALANCE_CONFIG.plus.tiles.find(tile => tile.key === "magic")?.count).toBe(5);
  });
});