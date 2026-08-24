import type { MomentData } from "@/lib/expressionsData";
import { PROFILES } from "@/lib/profilesData";
import momentCoffee from "@/assets/moment-coffee.jpg";

const KEY = "elyxer.myMoments";
const SEED_KEY = "elyxer.myMoments.seeded.v2";

let cache: MomentData[] | null = null;

const me = PROFILES[0];

const SEED_MOMENTS: MomentData[] = [
  {
    id: "my-seed-1",
    name: me.name,
    age: me.age,
    profession: me.profession,
    location: me.location,
    avatar: me.photos[0],
    text: "Slow Sunday, long coffee, no plans. Some days are meant to be unhurried.",
    photo: momentCoffee,
    moodTag: "Coffee & thoughts",
    timestamp: "3h ago",
  },
  {
    id: "my-seed-2",
    name: me.name,
    age: me.age,
    profession: me.profession,
    location: me.location,
    avatar: me.photos[0],
    text: "Walked home the long way tonight. The city feels softer after 10pm.",
    moodTag: "Finding calm",
    timestamp: "2 days ago",
    ended: true,
  },
];

function read(): MomentData[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      cache = JSON.parse(raw) as MomentData[];
    } else if (!localStorage.getItem(SEED_KEY)) {
      cache = [...SEED_MOMENTS];
      localStorage.setItem(SEED_KEY, "1");
      localStorage.setItem(KEY, JSON.stringify(cache));
    } else {
      cache = [];
    }
  } catch {
    cache = [...SEED_MOMENTS];
  }
  return cache;
}

function write(next: MomentData[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage full (large data-URL photos) — keep in-memory only
  }
}

export function getMyMoments(): MomentData[] {
  return [...read()];
}

export function addMyMoment(moment: MomentData) {
  write([moment, ...read().filter((m) => m.id !== moment.id)]);
}

export function updateMyMoment(moment: MomentData) {
  write(read().map((m) => (m.id === moment.id ? moment : m)));
}

export function removeMyMoment(id: string) {
  write(read().filter((m) => m.id !== id));
}
