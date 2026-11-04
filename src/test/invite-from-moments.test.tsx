import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Interests from "@/pages/Interests";
import { addInvite, dedupeByPerson, getInvites } from "@/lib/inviteStore";

/*
 * An invite sent from the Moments feed lands in the Interests Invites
 * tab and its card reads "From your moments". Invites sent from
 * Discover stay unlabelled. Each person has at most one invite card:
 * a newer invite to the same person replaces their earlier card.
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

  it("keeps one card per person when the same moment invites twice", () => {
    addInvite("R", "r.jpg", "Coffee", "Coffee?", 0, "moments", "moment:m1");
    const second = addInvite("R", "r.jpg", "Dinner", "Dinner instead?", 0, "moments", "moment:m1");

    const rCards = getInvites().filter((i) => i.name === "R");
    expect(rCards).toHaveLength(1);
    expect(rCards[0].id).toBe(second.id);
    expect(rCards[0].category).toBe("dinner");
    expect(getInvites()[0].id).toBe(second.id);
  });

  it("replaces the person's card when a different moment invites", () => {
    const latest = addInvite("R", "r.jpg", "Movie", "Movie night?", 0, "moments", "moment:m2");
    const rCards = getInvites().filter((i) => i.name === "R");
    expect(rCards).toHaveLength(1);
    expect(rCards[0].id).toBe(latest.id);
  });

  it("replaces the card on repeat invites without a moment", () => {
    addInvite("Priya", "p.jpg", "Coffee", "Coffee?", 3);
    addInvite("Priya", "p.jpg", "Dinner", "Dinner?", 3);
    expect(getInvites().filter((i) => i.name === "Priya")).toHaveLength(1);
  });

  it("cleans up duplicate cards already saved", () => {
    const dupes = [
      { id: "a", name: "R", photo: "", time: "", category: "coffee", categoryIcon: "", message: "", profileIndex: 0 },
      { id: "b", name: "R", photo: "", time: "", category: "movie", categoryIcon: "", message: "", profileIndex: 0 },
      { id: "c", name: "Sara", photo: "", time: "", category: "travel", categoryIcon: "", message: "", profileIndex: 2 },
    ];
    expect(dedupeByPerson(dupes).map((i) => i.id)).toEqual(["a", "c"]);
  });
});
