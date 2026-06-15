export interface SentVibe {
  id: string;
  name: string;
  photo: string;
  time: string;
  section: string;
  sectionEmoji: string;
  previewImage?: string;
  previewText?: string;
  profileIndex: number;
}

const STORAGE_KEY = "elyxer.sentVibes.v1";

function loadInitial(): SentVibe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SentVibe[]) : [];
  } catch {
    return [];
  }
}

let vibes: SentVibe[] = loadInitial();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vibes));
  } catch {
    /* ignore quota errors */
  }
}

function notify() {
  persist();
  listeners.forEach((l) => l());
}

export function subscribeVibes(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getVibes(): SentVibe[] {
  return vibes;
}

const SECTION_EMOJIS: Record<string, string> = {
  "Picture": "📸",
  "My Story": "📖",
  "Interests": "🎯",
  "Narratives": "✍️",
  "Join Me For": "🗺️",
  "moment": "✨",
};

export function addVibe(
  name: string,
  photo: string,
  section: string,
  profileIndex: number,
  previewImage?: string,
  previewText?: string,
): SentVibe {
  const vibe: SentVibe = {
    id: `vibe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    photo,
    time: "Just now",
    section,
    sectionEmoji: SECTION_EMOJIS[section] || "💜",
    previewImage,
    previewText,
    profileIndex,
  };

  vibes = [vibe, ...vibes];
  notify();
  return vibe;
}
