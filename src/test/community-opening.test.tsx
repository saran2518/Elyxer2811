import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/earlyAccess", () => ({
  EARLY_ACCESS_MODE: true,
  getEarlyAccessMember: vi.fn().mockResolvedValue({ memberNumber: null }),
  referenceEarlyAccessTotal: () => 2845,
}));
vi.mock("@/components/help/MailUsDialog", () => ({ default: () => null }));
import { EarlyAccessProvider, useEarlyAccess } from "@/components/early-access/EarlyAccessProvider";
import { screen, fireEvent } from "@testing-library/react";

describe("Early Access community opening", () => {
  it("opens on every fresh app mount even after dismissal", async () => {
    const first = renderHook(() => useEarlyAccess(), { wrapper: EarlyAccessProvider });
    expect(screen.getByRole("dialog", { name: "Growing community" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));
    first.unmount();
    const second = renderHook(() => useEarlyAccess(), { wrapper: EarlyAccessProvider });
    expect(screen.getByRole("dialog", { name: "Growing community" })).toBeInTheDocument();
    await act(async () => {});
    second.unmount();
  });
});