import {
  Sparkles,
  Smile,
  HeartHandshake,
  HandHeart,
  Palette,
  Music,
  Coffee,
  CloudRain,
  MessageCircle,
  Sunrise,
  Leaf,
  Camera,
  type LucideIcon,
} from "lucide-react";
import { PROFILES } from "@/lib/profilesData";
import momentCoffee from "@/assets/moment-coffee.jpg";
import momentTypewriter from "@/assets/moment-typewriter.jpg";
import momentPiano from "@/assets/moment-piano.jpg";
import momentSketch from "@/assets/moment-sketch.jpg";

export interface MomentData {
  id: string;
  name: string;
  age: number;
  profession: string;
  location: string;
  avatar: string;
  text: string;
  photo?: string;
  moodTag: string;
  timestamp: string;
  profileIndex?: number;
  /** true when the moment's live window has ended (can be reposted) */
  ended?: boolean;
}

export interface MoodTag {
  label: string;
  icon: LucideIcon;
}

export const MOOD_TAGS: MoodTag[] = [
  { label: "Little joys", icon: Sparkles },
  { label: "Feeling good", icon: Smile },
  { label: "In my feels", icon: HeartHandshake },
  { label: "Grateful today", icon: HandHeart },
  { label: "Creative spark", icon: Palette },
  { label: "Lost in music", icon: Music },
  { label: "Coffee & thoughts", icon: Coffee },
  { label: "Rainy day mood", icon: CloudRain },
  { label: "Random thoughts", icon: MessageCircle },
  { label: "Golden hour", icon: Sunrise },
  { label: "Finding calm", icon: Leaf },
  { label: "Captured a moment", icon: Camera },
];

export function getMoodIcon(label: string): LucideIcon | null {
  const found = MOOD_TAGS.find((m) => m.label === label);
  return found?.icon ?? null;
}

export const MOMENTS: MomentData[] = [
  {
    id: "m1",
    name: PROFILES[0].name,
    age: PROFILES[0].age,
    profession: PROFILES[0].profession,
    location: PROFILES[0].location,
    avatar: PROFILES[0].photos[0],
    text: "Finding beauty in the quiet moments. Looking for someone who appreciates early morning coffee and late-night architecture talks just as much as I do.",
    moodTag: "Finding calm",
    timestamp: "2h ago",
    profileIndex: 0,
  },
  {
    id: "m2",
    name: PROFILES[1]?.name || "Julian",
    age: PROFILES[1]?.age || 31,
    profession: PROFILES[1]?.profession || "Writer",
    location: PROFILES[1]?.location || "Brooklyn",
    avatar: PROFILES[1]?.photos[0] || PROFILES[0].photos[0],
    text: "Lost in the words today. The right ambiance changes everything.",
    photo: momentTypewriter,
    moodTag: "Creative spark",
    timestamp: "4h ago",
    profileIndex: 1,
  },
  {
    id: "m3",
    name: PROFILES[2]?.name || "Maya",
    age: PROFILES[2]?.age || 26,
    profession: PROFILES[2]?.profession || "Pianist",
    location: PROFILES[2]?.location || "Seattle",
    avatar: PROFILES[2]?.photos[0] || PROFILES[0].photos[0],
    text: "There is nothing quite like the silence that fills the room just before the first note is played. A moment of pure anticipation.",
    photo: momentPiano,
    moodTag: "Lost in music",
    timestamp: "6h ago",
    profileIndex: 2,
  },
  {
    id: "m4",
    name: PROFILES[3]?.name || "Arjun",
    age: PROFILES[3]?.age || 29,
    profession: PROFILES[3]?.profession || "Designer",
    location: PROFILES[3]?.location || "Mumbai",
    avatar: PROFILES[3]?.photos[0] || PROFILES[0].photos[0],
    text: "Sketched the sunrise from my balcony this morning. Some mornings just demand to be captured.",
    photo: momentSketch,
    moodTag: "Golden hour",
    timestamp: "8h ago",
    profileIndex: 3,
  },
  {
    id: "m5",
    name: PROFILES[4]?.name || "Priya",
    age: PROFILES[4]?.age || 27,
    profession: PROFILES[4]?.profession || "Chef",
    location: PROFILES[4]?.location || "Delhi",
    avatar: PROFILES[4]?.photos[0] || PROFILES[0].photos[0],
    text: "Tried a new recipe today — cardamom rose latte. The kitchen smells like a garden now.",
    photo: momentCoffee,
    moodTag: "Coffee & thoughts",
    timestamp: "12h ago",
    profileIndex: 4,
  },
  {
    id: "m6",
    name: PROFILES[5]?.name || "Rohan",
    age: PROFILES[5]?.age || 30,
    profession: PROFILES[5]?.profession || "Photographer",
    location: PROFILES[5]?.location || "Bangalore",
    avatar: PROFILES[5]?.photos[0] || PROFILES[0].photos[0],
    text: "Took a long walk through the old streets today. Sometimes wandering without a map is the best way to find yourself.",
    moodTag: "Finding calm",
    timestamp: "1 day ago",
    profileIndex: 5,
  },
  {
    id: "m7",
    name: PROFILES[6]?.name || "Ananya",
    age: PROFILES[6]?.age || 28,
    profession: PROFILES[6]?.profession || "Illustrator",
    location: PROFILES[6]?.location || "Pune",
    avatar: PROFILES[6]?.photos[0] || PROFILES[0].photos[0],
    text: "Rewatched an old favourite film last night. Funny how stories hit differently at different stages of life.",
    moodTag: "In my feels",
    timestamp: "2 days ago",
    profileIndex: 6,
  },
];
