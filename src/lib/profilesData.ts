import profileImage from "@/assets/profile-placeholder.jpg";
import profilePhoto2 from "@/assets/profile-photo-2.jpg";
import profilePhoto3 from "@/assets/profile-photo-3.jpg";
import profilePhoto4 from "@/assets/profile-photo-4.jpg";
import profilePhoto5 from "@/assets/profile-photo-5.jpg";
import profilePhoto6 from "@/assets/profile-photo-6.jpg";
import profileMaya from "@/assets/profile-maya.jpg";
import profileMaya2 from "@/assets/profile-maya-2.jpg";
import profileMaya3 from "@/assets/profile-maya-3.jpg";
import profileMaya4 from "@/assets/profile-maya-4.jpg";
import profileArjun from "@/assets/profile-arjun.jpg";
import profileArjun2 from "@/assets/profile-arjun-2.jpg";
import profileArjun3 from "@/assets/profile-arjun-3.jpg";
import profileArjun4 from "@/assets/profile-arjun-4.jpg";
import profilePriya from "@/assets/profile-priya.jpg";
import profilePriya2 from "@/assets/profile-priya-2.jpg";
import profilePriya3 from "@/assets/profile-priya-3.jpg";
import profilePriya4 from "@/assets/profile-priya-4.jpg";
import profileKaran from "@/assets/profile-karan.jpg";
import profileKaran2 from "@/assets/profile-karan-2.jpg";
import profileKaran3 from "@/assets/profile-karan-3.jpg";
import profileKaran4 from "@/assets/profile-karan-4.jpg";
import profileAnanya from "@/assets/profile-ananya.jpg";
import profileAnanya2 from "@/assets/profile-ananya-2.jpg";
import profileAnanya3 from "@/assets/profile-ananya-3.jpg";
import profileAnanya4 from "@/assets/profile-ananya-4.jpg";

export interface ProfileData {
  name: string;
  age: number;
  verified: boolean;
  profession: string;
  specialization: string;
  location: string;
  hometown: string;
  about: {
    gender: string;
    pronouns: string;
    orientation: string;
    education: string;
    height: string;
  };
  languages: string[];
  interests: string[];
  relationshipIntent: string[];
  bio: string;
  narratives: { title: string; content: string }[];
  joinMeFor: string[];
  photos: string[];
}

export const PROFILES: ProfileData[] = [
  {
    name: "R",
    age: 30,
    verified: true,
    profession: "Architect",
    specialization: "Sustainable Design",
    location: "Bangalore",
    about: {
      gender: "Man, Trans Man",
      pronouns: "He / Him, They / Them",
      orientation: "Straight",
      education: "Post Graduate",
      height: '6\'0"',
    },
    languages: ["English", "Hindi", "Kannada"],
    interests: ["Mountain hikes", "Vinyl music", "Slow Sundays", "Architecture", "Travel", "Photography"],
    relationshipIntent: ["Meaningful Connection", "Shared Experiences"],
    bio: "I'm an introverted soul who thrives in the quiet rhythm of the pottery wheel and the vast expanse of a mountain trail. I find my peace wandering through flower markets and exploring the world one trek at a time.",
    narratives: [
      { title: "Finding My Center", content: "I find my center when my hands are covered in clay and the rest of the world fades away." },
      { title: "The Summit Within", content: "There is nothing like the stillness of a summit after a long, challenging trek." },
    ],
    joinMeFor: [
      "Quiet pottery workshop afternoon",
      "High-altitude mountain trek",
      "Morning flower market stroll",
    ],
    photos: [profileImage, profilePhoto2, profilePhoto3, profilePhoto4, profilePhoto5, profilePhoto6],
  },
  {
    name: "Maya",
    age: 28,
    verified: true,
    profession: "Product Designer",
    specialization: "UX Strategy",
    location: "Mumbai",
    about: {
      gender: "Woman",
      pronouns: "She / Her",
      orientation: "Straight",
      education: "Bachelors",
      height: '5\'6"',
    },
    languages: ["English", "Hindi", "Marathi"],
    interests: ["Café hopping", "Sketching", "Indie films", "Jazz nights", "Cooking", "Yoga"],
    relationshipIntent: ["Keeping it Light", "Discovery Mode"],
    bio: "A design thinker by day and a jazz enthusiast by night. I believe the best conversations happen over a perfectly brewed pour-over and that every good story deserves a beautiful frame.",
    narratives: [
      { title: "The Art of Noticing", content: "I see stories in textures, colors in silence, and poetry in the everyday chaos of Mumbai streets." },
      { title: "Kitchen Experiments", content: "My kitchen is my laboratory — every failed recipe is just a draft for something extraordinary." },
    ],
    joinMeFor: [
      "A hidden café trail through Bandra",
      "Late-night jazz at a rooftop bar",
      "Weekend sketching at the art district",
    ],
    photos: [profileMaya, profileMaya2, profileMaya3, profileMaya4],
  },
  {
    name: "Arjun",
    age: 32,
    verified: true,
    profession: "Documentary Filmmaker",
    specialization: "Cultural Stories",
    location: "Delhi",
    about: {
      gender: "Man",
      pronouns: "He / Him",
      orientation: "Straight",
      education: "Masters",
      height: '5\'11"',
    },
    languages: ["English", "Hindi", "Punjabi"],
    interests: ["Storytelling", "Street food", "Old bookstores", "Guitar", "Travel writing", "Cricket"],
    relationshipIntent: ["Travel Buddy", "Shared Experiences"],
    bio: "I chase stories that deserve to be told — from the bylanes of Old Delhi to remote Himalayan villages. When I'm not behind the camera, you'll find me strumming my guitar on a quiet terrace or lost in a second-hand bookshop.",
    narratives: [
      { title: "Chasing Light", content: "The golden hour in the mountains taught me patience — some things are worth waiting for, quietly." },
      { title: "Stories Untold", content: "Every face on the street has a story. I just happened to choose a life of listening." },
    ],
    joinMeFor: [
      "A street food crawl through Chandni Chowk",
      "Sunrise drive to a nearby hill station",
      "An evening of live acoustic music",
    ],
    photos: [profileArjun, profileArjun2, profileArjun3, profileArjun4],
  },
  {
    name: "Priya",
    age: 26,
    verified: false,
    profession: "Literary Editor",
    specialization: "Fiction & Poetry",
    location: "Kolkata",
    about: {
      gender: "Woman",
      pronouns: "She / Her",
      orientation: "Bisexual",
      education: "Masters",
      height: '5\'4"',
    },
    languages: ["English", "Hindi", "Bengali"],
    interests: ["Poetry", "Thrift shopping", "Rainy days", "Theatre", "Journaling", "Chai culture"],
    relationshipIntent: ["Meaningful Connection", "Discovery Mode"],
    bio: "Words are my world — I edit fiction for a living and write poetry for my soul. I fall in love with rainy afternoons in old Kolkata, the smell of musty bookshops, and the magic of a perfectly written sentence.",
    narratives: [
      { title: "Between the Lines", content: "The best love stories are the ones you read between the lines — in silence, in subtlety, in stolen glances." },
      { title: "Kolkata Monsoons", content: "There's a peculiar romance to Kolkata in the monsoons — the city slows down just enough for you to feel everything." },
    ],
    joinMeFor: [
      "A poetry reading at a candlelit café",
      "Thrift shopping in College Street",
      "A long walk along the Hooghly at dusk",
    ],
    photos: [profilePriya, profilePriya2, profilePriya3, profilePriya4],
  },
  {
    name: "Karan",
    age: 29,
    verified: true,
    profession: "Startup Founder",
    specialization: "Climate Tech",
    location: "Pune",
    about: {
      gender: "Man",
      pronouns: "He / Him",
      orientation: "Straight",
      education: "MBA",
      height: '5\'10"',
    },
    languages: ["English", "Hindi", "Marathi"],
    interests: ["Running", "Sustainability", "Board games", "Sci-fi", "Cooking", "Wine tasting"],
    relationshipIntent: ["Meaningful Connection", "Keeping it Light"],
    bio: "Building a climate tech startup by day, perfecting risotto by night. I believe in running — both marathons and toward the things that matter. Looking for someone who's excited about the future we're building.",
    narratives: [
      { title: "The Long Run", content: "Every marathon taught me the same lesson — the hardest miles are the ones where you discover who you really are." },
      { title: "Future Forward", content: "I dream of a world where sustainability isn't a choice but a way of life. That dream keeps me up at night — in the best way." },
    ],
    joinMeFor: [
      "Early morning trail run in the Sahyadris",
      "A competitive board game night",
      "Farm-to-table dinner at a local vineyard",
    ],
    photos: [profileKaran, profileKaran2, profileKaran3, profileKaran4],
  },
  {
    name: "Ananya",
    age: 31,
    verified: true,
    profession: "Classical Dancer",
    specialization: "Bharatanatyam",
    location: "Chennai",
    about: {
      gender: "Woman",
      pronouns: "She / Her",
      orientation: "Straight",
      education: "Bachelors",
      height: '5\'5"',
    },
    languages: ["English", "Tamil", "Telugu"],
    interests: ["Dance", "Temple visits", "South Indian cuisine", "Carnatic music", "Meditation", "Travel"],
    relationshipIntent: ["Travel Buddy", "Meaningful Connection"],
    bio: "My life is a rhythm — between the beats of Bharatanatyam and the melodies of Carnatic music. I find divinity in art and peace in temple courtyards. Looking for someone who values depth, tradition, and the beauty of slowing down.",
    narratives: [
      { title: "The Language of Movement", content: "Dance is my first language — every mudra tells a story that words could never capture." },
      { title: "Sacred Spaces", content: "I find my deepest peace in the quiet corridors of ancient temples, where time seems to stand completely still." },
    ],
    joinMeFor: [
      "A Carnatic music concert under the stars",
      "Temple trail through Mahabalipuram",
      "Authentic South Indian cooking together",
    ],
    photos: [profileAnanya, profileAnanya2, profileAnanya3, profileAnanya4],
  },
];
