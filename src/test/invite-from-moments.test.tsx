import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Interests from "@/pages/Interests";
import { addInvite, getInvites } from "@/lib/inviteStore";

/*
 * An invite sent from the Moments feed lands in the Interests Invites
 * tab and its card reads "From your moments". Invites sent from
 * Discover stay unlabelled. Repeat sends from the same moment replace
 * that moment's card instead of stacking another one, while different
 * moments keep their own cards.
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

  it("keeps one card per moment when the same moment invites twice", () => {
    addInvite("R", "r.jpg", "Coffee", "Coffee?", 0, "moments", "moment:m1");
    const second = addInvite("R", "r.jpg", "Dinner", "Dinner instead?", 0, "moments", "moment:m1");

    const fromM1 = getInvites().filter((i) => i.key === "moment:m1");
    expect(fromM1).toHaveLength(1);
    expect(fromM1[0].id).toBe(second.id);
    expect(fromM1[0].category).toBe("dinner");
    expect(fromM1[0].message).toBe("Dinner instead?");
    expect(getInvites()[0].id).toBe(second.id);
  });

  it("keeps separate cards for different moments", () => {
    addInvite("R", "r.jpg", "Movie", "Movie night?", 0, "moments", "moment:m2");
    expect(getInvites().filter((i) => i.key === "moment:m2")).toHaveLength(1);
    expect(getInvites().filter((i) => i.key === "moment:m1")).toHaveLength(1);
  });

  it("keeps separate cards when no moment is involved", () => {
    addInvite("Karan", "k.jpg", "Travel", "Goa next month?", 4, "discover", "profile:4");
    addInvite("Karan", "k.jpg", "Travel", "Goa next month?", 4, "discover", "profile:4");
    expect(getInvites().filter((i) => i.key === "profile:4")).toHaveLength(1);

    addInvite("Priya", "p.jpg", "Coffee", "Coffee?", 3);
    addInvite("Priya", "p.jpg", "Coffee", "Coffee?", 3);
    expect(getInvites().filter((i) => i.name === "Priya")).toHaveLength(2);
  });
});
