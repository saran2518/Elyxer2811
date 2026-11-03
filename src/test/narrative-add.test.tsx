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

const TWO = [
  { title: "First", content: CONTENT },
  { title: "Second", content: CONTENT },
];

// Vaul leaves aria-hidden on the page in jsdom after a drawer closes,
// so the section button must be looked up with hidden:true.
const addButton = () =>
  screen.getByRole("button", { name: "Add narrative" }, { hidden: true });

describe("Adding a narrative back", () => {
  it("appends a narrative typed after one was removed", () => {
    const onProfileChange = vi.fn();
    render(<ProfileOutput profile={profile(TWO)} onProfileChange={onProfileChange} />);

    // Remove the first one.
    fireEvent.click(screen.getAllByLabelText("Edit narrative")[0]);
    fireEvent.click(screen.getByRole("button", { name: "Remove narrative" }));

    // Change of mind: add a new one.
    fireEvent.click(screen.getByRole("button", { name: "Add narrative" }));
    expect(screen.getByText("Add Narrative")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Narrative title"), { target: { value: "Third" } });
    fireEvent.change(screen.getByLabelText("Narrative content"), { target: { value: CONTENT } });
    fireEvent.click(screen.getByRole("button", { name: /^Save$/ }));

    expect(onProfileChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        narratives: [
          { title: "Second", content: CONTENT },
          { title: "Third", content: CONTENT },
        ],
      })
    );
  });

  it("keeps the minimum word reminders in add mode", () => {
    render(<ProfileOutput profile={profile(TWO)} onProfileChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Add narrative" }));

    expect(screen.getByText("Title needs at least 1 word")).toBeInTheDocument();
    expect(screen.getByText("Content needs at least 2 words")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Save$/ })).toBeDisabled();
  });

  it("offers no removal while adding", () => {
    render(<ProfileOutput profile={profile(TWO)} onProfileChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Add narrative" }));

    expect(screen.queryByRole("button", { name: "Remove narrative" })).not.toBeInTheDocument();
  });

  it("stops adding at three narratives", () => {
    render(
      <ProfileOutput
        profile={profile([
          { title: "First", content: CONTENT },
          { title: "Second", content: CONTENT },
          { title: "Third", content: CONTENT },
        ])}
        onProfileChange={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Add narrative" })).toBeDisabled();
    expect(screen.getByText("Maximum 3 narratives.")).toBeInTheDocument();
  });
});
