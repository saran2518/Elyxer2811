import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Interests from "@/pages/Interests";
import { INTERESTS_FREE_MODE_LOCKS } from "@/config/interestsAccess";

/*
 * Interests is open to free members for now: no blurred cards,
 * no Free / Plus switch in the header. Turning the switch back
 * on is a one-line change in src/config/interestsAccess.ts.
 */

describe("Interests free mode", () => {
  it("is open for now", () => {
    expect(INTERESTS_FREE_MODE_LOCKS).toBe(false);
  });

  it("shows no locked card and no Free/Plus switch", () => {
    render(
      <MemoryRouter>
        <Interests />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole("button", {
        name: "Tap to view profile and respond",
      }),
    ).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Toggle subscription preview" }),
    ).toBeNull();
  });
});
