import { useSyncExternalStore } from "react";
import { PROFILES } from "@/lib/profilesData";

export type AboutFields = {
  datingPreference: string;
  gender: string;
  pronouns: string;
  orientation: string;
  datingGoals: string;
  education: string;
  profession: string;
  location: string;
  hometown: string;
  height: string;
  languages: string;
};

const template = PROFILES[0];

const initial: AboutFields = {
  datingPreference: "Women",
  gender: template.about.gender,
  pronouns: template.about.pronouns,
  orientation: template.about.orientation,
  datingGoals: template.relationshipIntent?.[0] ?? "Long-term relationship",
  education: template.about.education,
  profession: template.profession,
  location: template.location,
  hometown: template.hometown ?? "",
  height: template.about.height,
  languages: template.languages?.join(", ") ?? "English",
};

let draft: AboutFields = { ...initial };
let committed: AboutFields = { ...initial };

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((cb) => cb());
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const getDraft = () => draft;
const computeDirty = () =>
  (Object.keys(draft) as (keyof AboutFields)[]).some((k) => draft[k] !== committed[k]);

// Cached snapshot so useSyncExternalStore stays stable.
let cachedDirty = computeDirty();
const getDirty = () => cachedDirty;

export function useAboutFields(): AboutFields {
  return useSyncExternalStore(subscribe, getDraft, getDraft);
}

export function useAboutDirty(): boolean {
  return useSyncExternalStore(subscribe, getDirty, getDirty);
}

export function setAboutField<K extends keyof AboutFields>(key: K, value: AboutFields[K]) {
  if (draft[key] === value) return;
  draft = { ...draft, [key]: value };
  cachedDirty = computeDirty();
  notify();
}

export function getAboutFields(): AboutFields {
  return draft;
}

export function commitAboutFields() {
  committed = { ...draft };
  cachedDirty = false;
  notify();
}

export function discardAboutFields() {
  draft = { ...committed };
  cachedDirty = false;
  notify();
}
