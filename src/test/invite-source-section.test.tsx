import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Interests from "@/pages/Interests";
import { addInvite, getInvites, inviteSectionEmoji } from "@/lib/inviteStore";

/*
 * Every invite in the Interests invite tab says which part of the
 * profile it came from: Picture, My Story, Narratives, Join Me For
 * or Moment.
 */

describe("Invite source section", () => {
  it("records the section the invite was sent from", () => {
    const before = getInvites().length;
    addInvite("Riya", "", "Coffee", "Coffee on Saturday?", 0, "Narratives");

    const invite = getInvites()[0];
    expect(getInvites().length).toBe(before + 1);
    expect(invite.section).toBe("Narratives");
    expect(invite.sectionEmoji).toBe("✍️");
  });

  it("falls back to Picture when no section is given", () => {
    addInvite("Kabir", "", "Dinner", "Dinner tonight?", 1);

    const invite = getInvites()[0];
    expect(invite.section).toBe("Picture");
    expect(invite.sectionEmoji).toBe("📸");
  });

  it("labels a moment invite with the moment emoji", () => {
    addInvite("Sana", "", "Movie", "Film night?", 2, "Moment");

    expect(getInvites()[0].sectionEmoji).toBe("✨");
  });

  it("uses a neutral emoji for an unknown section", () => {
    expect(inviteSectionEmoji("Something Else")).toBe("💜");
  });

  it("shows the source section on the invite tab", () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/interests", state: { tab: "invites" } }]}
      >
        <Interests />
      </MemoryRouter>,
    );

    expect(screen.getAllByText(/Sent invite to your/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Narratives").length).toBeGreaterThan(0);
  });
});
