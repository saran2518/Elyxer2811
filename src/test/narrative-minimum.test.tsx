import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfileOutput from "@/components/ProfileOutput";
import type { GeneratedProfile } from "@/lib/profileGenerator";

const CONTENT = "one two three four five six seven eight";

const profile = (narratives: { title: string; content: string }[]): GeneratedProfile => ({
  bio: "A long enough story about slow mornings and long walks.",
  interests: ["Jazz", "Hiking"],
  narratives,
  joinMeFor: ["Sunset hikes"],
});

const openNarrative = (index: number) => {
  fireEvent.click(screen.getAllByLabelText("Edit narrative")[index]);
};

describe("Narrative minimum", () => {
  it("removes a narrative when more than one remains", () => {
    const onProfileChange = vi.fn();
    render(
      <ProfileOutput
        profile={profile([
          { title: "First", content: CONTENT },
          { title: "Second", content: CONTENT },
        ])}
        onProfileChange={onProfileChange}
      />
    );

    openNarrative(0);
    fireEvent.click(screen.getByRole("button", { name: "Remove narrative" }));

    expect(onProfileChange).toHaveBeenCalledWith(
      expect.objectContaining({
        narratives: [{ title: "Second", content: CONTENT }],
      })
    );
  });

  it("disables removal once only one narrative is left", () => {
    const onProfileChange = vi.fn();
    render(
      <ProfileOutput
        profile={profile([{ title: "Only", content: CONTENT }])}
        onProfileChange={onProfileChange}
      />
    );

    openNarrative(0);
    const remove = screen.getByRole("button", { name: "Remove narrative" });

    expect(remove).toBeDisabled();
    expect(screen.getByText("Keep at least one narrative.")).toBeInTheDocument();

    fireEvent.click(remove);
    expect(onProfileChange).not.toHaveBeenCalled();
  });
});
