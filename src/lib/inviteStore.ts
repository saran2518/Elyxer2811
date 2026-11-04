export type InviteSource = "moments" | "discover";

export interface SentInvite {
  id: string;
  name: string;
  photo: string;
  time: string;
  category: string;
  categoryIcon: string;
  message: string;
  accepted?: boolean;
  profileIndex: number;
  source?: InviteSource;
  key?: string;
}


const STORAGE_KEY = "elyxer.sentInvites.v1";

/** One invite card per person: identity is the profile index plus name. */
export function personKey(i: Pick<SentInvite, "name" | "profileIndex">): string {
  return `${i.profileIndex ?? 0}:${i.name}`;
}

/** Keeps only the newest card (first in the list) for each person. */
export function dedupeByPerson(list: SentInvite[]): SentInvite[] {
  const seen = new Set<string>();
  return list.filter((i) => {
    const k = personKey(i);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function loadInitial(): SentInvite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? dedupeByPerson(JSON.parse(raw) as SentInvite[]) : [];
  } catch {
    return [];
  }
}

let invites: SentInvite[] = loadInitial();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));
  } catch {
    /* ignore quota errors */
  }
}

function notify() {
  persist();
  listeners.forEach((l) => l());
}

export function subscribeInvites(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getInvites(): SentInvite[] {
  return invites;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Coffee: "☕",
  Dinner: "🍽️",
  Movie: "🎬",
  "Virtual Date": "💻",
  "A Long Walk": "🌿",
  Travel: "✈️",
  "Pet Play Date": "🐾",
  Other: "✨",
};

export function addInvite(name: string, photo: string, category: string, message: string, profileIndex: number = 0, source?: InviteSource, key?: string): SentInvite {
  const invite: SentInvite = {
    id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    photo,
    time: "Just now",
    category: category.toLowerCase(),
    categoryIcon: CATEGORY_EMOJIS[category] || "✨",
    message,
    accepted: false,
    profileIndex,
    source,
    key,
  };


  // A newer invite to the same person replaces their earlier card.
  const pk = personKey(invite);
  invites = [invite, ...invites.filter((i) => personKey(i) !== pk)];
  notify();
  return invite;
}
