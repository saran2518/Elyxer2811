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

describe("scratch", () => {
  it("inspect after remove", () => {
    render(<ProfileOutput profile={profile([{ title: "First", content: CONTENT }, { title: "Second", content: CONTENT }])} onProfileChange={vi.fn()} />);
    fireEvent.click(screen.getAllByLabelText("Edit narrative")[0]);
    fireEvent.click(screen.getByRole("button", { name: "Remove narrative" }));
    const add = screen.getByText("Add narrative");
    console.log("FOUND VIA TEXT:", add.tagName, "disabled:", (add as HTMLButtonElement).disabled);
    console.log("ARIA HIDDEN ANCESTORS:", (() => {
      let el: HTMLElement | null = add; const out: string[] = [];
      while (el) { if (el.getAttribute && el.getAttribute("aria-hidden") === "true") out.push(el.tagName + "." + String(el.className).slice(0, 40)); el = el.parentElement; }
      return out.join(" | ") || "none";
    })());
    expect(true).toBe(true);
  });
});
