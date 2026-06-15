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
}

const STORAGE_KEY = "elyxer.sentInvites.v1";

function loadInitial(): SentInvite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SentInvite[]) : [];
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

export function addInvite(name: string, photo: string, category: string, message: string, profileIndex: number = 0): SentInvite {
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
  };

  invites = [invite, ...invites];
  notify();
  return invite;
}
