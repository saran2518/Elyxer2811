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
const SEEDED_KEY = "elyxer.sentVibes.seeded.v2";

function sampleSeed(): SentVibe[] {
  return [
    {
      id: "vibe-sample-moment-1",
      name: "Julian",
      photo: new URL("../assets/profile-photo-2.jpg", import.meta.url).href,
      time: "2h ago",
      section: "moment",
      sectionEmoji: "✨",
      previewImage: new URL("../assets/moment-typewriter.jpg", import.meta.url).href,
      previewText: "Lost in the words today. The right ambiance changes everything.",
      profileIndex: 1,
    },
  ];
}

function loadInitial(): SentVibe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as SentVibe[]) : [];
    if (!window.localStorage.getItem(SEEDED_KEY)) {
      const seed = sampleSeed();
      const merged = [...existing, ...seed.filter(s => !existing.some(e => e.id === s.id))];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.localStorage.setItem(SEEDED_KEY, "1");
      return merged;
    }
    return existing;
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
