import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Interests from "@/pages/Interests";
import { addInvite, getInvites } from "@/lib/inviteStore";

/*
 * An invite sent from the Moments feed lands in the Interests Invites
 * tab and its card reads "From your moments". Invites sent from
 * Discover stay unlabelled.
 */

describe("invites from Moments", () => {
  it("records the moments source on a moments invite", () => {
    const invite = addInvite("Nina", "nina.jpg", "Coffee", "Coffee tomorrow?", 0, "moments");
    expect(invite.source).toBe("moments");
    expect(getInvites()[0].id).toBe(invite.id);
    expect(getInvites()[0].source).toBe("moments");
  });

  it("leaves a discover invite unlabelled", () => {
    const invite = addInvite("Ravi", "ravi.jpg", "Dinner", "Dinner on Friday?", 1);
    expect(invite.source).toBeUndefined();
  });

  it("shows 'From your moments' only on the moments invite card", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/interests", state: { tab: "invites" } }]}>
        <Interests />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("From your moments")).toHaveLength(1);
    expect(screen.getByText("Nina")).toBeInTheDocument();
  });
});
