// TEMP DEV-ONLY seed for screenshotting chat states. Safe to delete.
import {
  createThread,
  addMessage,
  updateMessageStatus,
  addVirtualDateInvite,
  setTyping,
} from "./chatStore";

const PHOTOS = {
  ananya: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
  priya: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  riya: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
  meera: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  kavya: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=400",
};

let seeded = false;
export function seedChatDemo() {
  if (seeded) return;
  seeded = true;

  // 1) Connection only (no messages from "me")
  createThread("Ananya", PHOTOS.ananya, "vibe");

  // 2) Active conversation - all message states
  const t2 = createThread("Priya", PHOTOS.priya, "invite");
  const m1 = addMessage(t2.id, "Hey! How's your weekend going? 😊", "me");
  updateMessageStatus(t2.id, m1, "sent");
  addMessage(t2.id, "Pretty good! Just got back from a hike 🌿", "them");
  const m2 = addMessage(t2.id, "That sounds amazing!", "me");
  updateMessageStatus(t2.id, m2, "sent");
  const m3 = addMessage(t2.id, "Want to grab coffee sometime?", "me");
  updateMessageStatus(t2.id, m3, "failed");

  // 3) Conversation with image attachment
  const t3 = createThread("Riya", PHOTOS.riya, "vibe");
  addMessage(t3.id, "Look at this sunset!", "them",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600");
  const m4 = addMessage(t3.id, "Wow stunning 😍", "me");
  updateMessageStatus(t3.id, m4, "sent");
  const m5 = addMessage(t3.id, "", "me",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600");
  updateMessageStatus(t3.id, m5, "sent");

  // 4) Virtual date invite (pending)
  const t4 = createThread("Meera", PHOTOS.meera, "invite");
  const mh = addMessage(t4.id, "Would love to video chat!", "me");
  updateMessageStatus(t4.id, mh, "sent");
  addVirtualDateInvite(t4.id, "me");

  // 5) Typing indicator
  const t5 = createThread("Kavya", PHOTOS.kavya, "vibe");
  const mt = addMessage(t5.id, "Tell me about your favorite trip ✈️", "me");
  updateMessageStatus(t5.id, mt, "sent");
  setTyping(t5.id, true);
}
