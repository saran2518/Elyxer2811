// Lays out the About section dynamically: optional fields (gender, pronouns,
// orientation) that a member leaves blank are hidden, and rows rebalance.
export interface AboutRow<T> {
  items: T[];
  cols: number;
}

export function layoutAboutItems<T extends { value?: string | null }>(all: T[]): AboutRow<T>[] {
  const items = all.filter((i) => typeof i.value === "string" && i.value.trim() !== "");
  const n = items.length;
  if (n === 0) return [];
  if (n <= 3) return [{ items, cols: n }];
  if (n === 4) return [{ items: items.slice(0, 2), cols: 2 }, { items: items.slice(2), cols: 2 }];
  const hasMulti = items.slice(0, 3).some((i) => (i.value as string).includes(","));
  const split = hasMulti ? 2 : 3;
  return [
    { items: items.slice(0, split), cols: split },
    { items: items.slice(split), cols: n - split },
  ];
}
