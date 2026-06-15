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

let vibes: SentVibe[] = [];
const listeners = new Set<() => void>();

function notify() {
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
