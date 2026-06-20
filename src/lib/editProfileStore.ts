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
  height: string;
  languages: string;
};

const template = PROFILES[0];

let state: AboutFields = {
  datingPreference: "Women",
  gender: template.about.gender,
  pronouns: template.about.pronouns,
  orientation: template.about.orientation,
  datingGoals: template.relationshipIntent?.[0] ?? "Long-term relationship",
  education: template.about.education,
  profession: template.profession,
  location: template.location,
  height: template.about.height,
  languages: template.languages?.join(", ") ?? "English",
};

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => state;

export function useAboutFields(): AboutFields {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function setAboutField<K extends keyof AboutFields>(key: K, value: AboutFields[K]) {
  if (state[key] === value) return;
  state = { ...state, [key]: value };
  listeners.forEach((cb) => cb());
}

export function getAboutFields(): AboutFields {
  return state;
}
