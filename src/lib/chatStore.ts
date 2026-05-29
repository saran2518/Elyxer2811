export interface ChatThread {
  id: string;
  name: string;
  photo: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  source: "vibe" | "invite";
  messages: ChatMessage[];
  typing?: boolean;
}

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface ReplyPreview {
  id: string;
  sender: "me" | "them" | "system";
  text: string;
  image?: string;
}

export interface ChatMessage {
  id: string;
  sender: "me" | "them" | "system";
  text: string;
  time: string;
  image?: string; // data URL for in-memory image attachments
  type?: "text" | "virtual-date-invite" | "virtual-date-response" | "system";
  dateInviteStatus?: "pending" | "accepted" | "declined";
  status?: MessageStatus;
  replyTo?: ReplyPreview;
}

let threads: ChatThread[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

// Return the same reference — only mutated via createThread/addMessage which reassign `threads`
export function getThreads(): ChatThread[] {
  return threads;
}

export function isLoaded(): boolean {
  return loaded;
}

export function markLoaded() {
  if (loaded) return;
  loaded = true;
  notify();
}

export function createThread(
  name: string,
  photo: string,
  source: "vibe" | "invite",
  perspective: "recipient" | "initiator" = "recipient",
): ChatThread {
  const existing = threads.find((t) => t.name === name);
  if (existing) return existing;

  // recipient = current user reciprocated (vibed back / accepted invite)
  // initiator = current user sent the original vibe/invite and the other reciprocated
  const greeting =
    perspective === "recipient"
      ? source === "vibe"
        ? `You and ${name} vibed! Start a conversation 💬`
        : `You and ${name} are connected! Start a conversation 💬`
      : source === "vibe"
        ? `${name} vibed back! Start a conversation 💬`
        : `${name} accepted your invite! Start a conversation 💬`;

  const thread: ChatThread = {
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    photo,
    lastMessage: greeting,
    time: "Just now",
    unread: true,
    source,
    messages: [
      { id: "system-1", sender: "system", text: greeting, time: "Just now", type: "system" },
    ],
  };

  threads = [thread, ...threads];
  notify();
  return thread;
}

export function removeThread(threadId: string) {
  threads = threads.filter((t) => t.id !== threadId);
  notify();
}

export function addMessage(
  threadId: string,
  text: string,
  sender: "me" | "them",
  image?: string,
  status?: MessageStatus,
  replyTo?: ReplyPreview,
): string {
  const displayText = image ? (text || "📷 Photo") : text;
  const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const initialStatus: MessageStatus | undefined =
    sender === "me" ? status ?? "sending" : undefined;
  threads = threads.map((t) =>
    t.id === threadId
      ? {
          ...t,
          lastMessage: displayText,
          time: "Just now",
          messages: [
            ...t.messages,
            { id, sender, text, time: "Just now", image, status: initialStatus, replyTo },
          ],
        }
      : t
  );
  notify();
  return id;
}

export function updateMessageStatus(threadId: string, messageId: string, status: MessageStatus) {
  threads = threads.map((t) =>
    t.id === threadId
      ? {
          ...t,
          messages: t.messages.map((m) =>
            m.id === messageId ? { ...m, status } : m
          ),
        }
      : t
  );
  notify();
}

export function setTyping(threadId: string, typing: boolean) {
  let changed = false;
  threads = threads.map((t) => {
    if (t.id !== threadId) return t;
    if (!!t.typing === typing) return t;
    changed = true;
    return { ...t, typing };
  });
  if (changed) notify();
}

export function addVirtualDateInvite(threadId: string, sender: "me" | "them"): string {
  const msgId = `vd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  threads = threads.map((t) =>
    t.id === threadId
      ? {
          ...t,
          lastMessage: "📹 Virtual Date Invite",
          time: "Just now",
          messages: [
            ...t.messages,
            {
              id: msgId,
              sender,
              text: "📹 Virtual Date Invite",
              time: "Just now",
              type: "virtual-date-invite" as const,
              dateInviteStatus: "pending" as const,
            },
          ],
        }
      : t
  );
  notify();
  return msgId;
}

export function updateMessageInviteStatus(threadId: string, messageId: string, status: "accepted" | "declined") {
  threads = threads.map((t) =>
    t.id === threadId
      ? {
          ...t,
          messages: t.messages.map((m) =>
            m.id === messageId ? { ...m, dateInviteStatus: status } : m
          ),
        }
      : t
  );
  notify();
}
