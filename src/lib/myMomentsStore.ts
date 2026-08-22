import type { MomentData } from "@/lib/expressionsData";

const KEY = "elyxer.myMoments";

let cache: MomentData[] | null = null;

function read(): MomentData[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as MomentData[]) : [];
  } catch {
    cache = [];
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
