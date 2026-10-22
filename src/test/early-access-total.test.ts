import { describe, expect, it, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({ supabase: { rpc: vi.fn() } }));
import { supabase } from "@/integrations/supabase/client";
import { getEarlyAccessTotal, visibleEarlyAccessTotal } from "@/lib/earlyAccess";

describe("community total", () => {
  it("allows a positive integer total", () => {
    expect(visibleEarlyAccessTotal(2845)).toBe(2845);
  });
  it("hides zero and non-count placeholders", () => {
    for (const value of [0, null, undefined, "—", "2845", -1, 1.5]) {
      expect(visibleEarlyAccessTotal(value)).toBeNull();
    }
  });
  it("hides failed fetches", async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({ data: null, error: { message: "failed" } } as never);
    expect(await getEarlyAccessTotal()).toBeNull();
  });
  it("fetches the total again for each request", async () => {
    vi.mocked(supabase.rpc).mockClear();
    vi.mocked(supabase.rpc).mockResolvedValue({ data: 2845, error: null } as never);
    expect(await getEarlyAccessTotal()).toBe(2845);
    expect(await getEarlyAccessTotal()).toBe(2845);
    expect(supabase.rpc).toHaveBeenCalledTimes(2);
    expect(supabase.rpc).toHaveBeenCalledWith("get_early_access_total");
  });
});