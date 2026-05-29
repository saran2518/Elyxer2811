import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Heart,
  HeartPulse,
  MessageCircle,
  Users,
  Sparkles,
  Send,
  Clock,
  SlidersHorizontal,
  Filter,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatThreads, useChatLoaded } from "@/hooks/useChatStore";
import { ChatThread, markLoaded, restoreThread } from "@/lib/chatStore";
import ChatDetail from "@/components/chat/ChatDetail";

const ACTIVE_CHAT_SNAPSHOT_KEY = "elyxer-active-chat-thread-v1";
type OpenChatLocationState = {
  openThreadId?: string;
  openThreadSnapshot?: ChatThread;
} | null;

/* ─── Chat List ──────────────────────────────────────── */

function ChatList({
  threads,
  onOpenThread,
}: {
  threads: ChatThread[];
  onOpenThread: (id: string) => void;
}) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto space-y-1 px-4 pb-4">
      {threads.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1))" }}
          >
            <MessageCircle className="h-7 w-7 text-primary/50" />
          </div>
          <p className="font-display text-base font-semibold text-foreground/70">
            No chats yet
          </p>
        </motion.div>
      )}
      {threads.map((thread, i) => (
        <motion.button
          key={thread.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
          onClick={() => onOpenThread(thread.id)}
          className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 transition-all duration-200 group"
        >
          <div className="relative shrink-0">
            <img
              src={thread.photo}
              alt={thread.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10 ring-offset-2 ring-offset-background"
            />
            {thread.unread && (
              <div
                className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background"
                style={{ background: "var(--gradient-warm)" }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <p className="font-display text-[15px] font-bold text-card-foreground truncate">
                  {thread.name}
                </p>
                <span
                  className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-primary-foreground"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  {thread.source === "vibe" ? (
                    <HeartPulse className="h-2.5 w-2.5" />
                  ) : (
                    <Send className="h-2.5 w-2.5" />
                  )}
                  {thread.source}
                </span>
              </div>
              <span className="font-body text-[11px] text-muted-foreground shrink-0 ml-2">
                {thread.time}
              </span>
            </div>
            <p className="font-body text-[13px] text-muted-foreground truncate mt-0.5">
              {thread.lastMessage}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

/* (ChatDetail is now in src/components/chat/ChatDetail.tsx) */

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const threads = useChatThreads();
  const loaded = useChatLoaded();
  const activeThreadId = searchParams.get("thread");
  const [activeThreadSnapshot, setActiveThreadSnapshot] = useState<ChatThread | null>(null);
  const activeThreadFromStore = activeThreadId
    ? threads.find((t) => t.id === activeThreadId) ?? null
    : null;
  const activeThread = activeThreadFromStore ?? (activeThreadSnapshot?.id === activeThreadId ? activeThreadSnapshot : null);

  const [convFilter, setConvFilter] = useState<"all" | "vibes" | "invites" | "recent">("all");

  // Simulate initial load so the user briefly sees a skeleton state.
  useEffect(() => {
    if (loaded) return;
    const t = window.setTimeout(() => markLoaded(), 500);
    return () => window.clearTimeout(t);
  }, [loaded]);

  useEffect(() => {
    if (!activeThreadId) {
      setActiveThreadSnapshot(null);
      window.sessionStorage.removeItem(ACTIVE_CHAT_SNAPSHOT_KEY);
      return;
    }
    if (activeThreadFromStore) {
      setActiveThreadSnapshot(activeThreadFromStore);
      window.sessionStorage.setItem(
        ACTIVE_CHAT_SNAPSHOT_KEY,
        JSON.stringify(activeThreadFromStore)
      );
    }
  }, [activeThreadId, activeThreadFromStore]);

  useEffect(() => {
    if (!activeThreadId || activeThreadFromStore) return;

    const raw = window.sessionStorage.getItem(ACTIVE_CHAT_SNAPSHOT_KEY);
    if (!raw) return;

    try {
      const snapshot = JSON.parse(raw) as ChatThread;
      if (snapshot?.id !== activeThreadId) return;

      restoreThread(snapshot);
      setActiveThreadSnapshot(snapshot);
    } catch {
      window.sessionStorage.removeItem(ACTIVE_CHAT_SNAPSHOT_KEY);
    }
  }, [activeThreadId, activeThreadFromStore]);

  // Auto-open thread if a new openThreadId arrives via navigation state, then
  // clear that state so subsequent re-renders (loaded toggling, store updates,
  // etc.) cannot re-trigger this effect and momentarily unmount the open
  // detail view — which previously made the chat window "collapse" right
  // after opening from the Mutual Vibe / Invite Accepted dialogs.
  useEffect(() => {
    const openState = location.state as OpenChatLocationState;
    const openSnapshot = openState?.openThreadSnapshot;
    const openId = openState?.openThreadId ?? openSnapshot?.id ?? null;
    if (!openId) return;

    if (openSnapshot) {
      restoreThread(openSnapshot);
      setActiveThreadSnapshot(openSnapshot);
      window.sessionStorage.setItem(
        ACTIVE_CHAT_SNAPSHOT_KEY,
        JSON.stringify(openSnapshot)
      );
    }

    const nextParams = new URLSearchParams(location.search);
    nextParams.set("thread", openId);
    navigate(
      { pathname: location.pathname, search: `?${nextParams.toString()}` },
      { replace: true, state: null }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const openThread = (id: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("thread", id);
    setSearchParams(nextParams);
  };

  const closeThread = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("thread");
    setSearchParams(nextParams);
  };

  // Connections: only system greeting, no user messages yet
  const connections = threads.filter(
    (t) => !t.messages.some((m) => m.sender === "me")
  );
  // Conversations: user has sent at least one message
  const conversations = threads.filter(
    (t) => t.messages.some((m) => m.sender === "me")
  );

  const filteredConversations = (() => {
    let list = conversations;
    if (convFilter === "vibes") {
      list = list.filter((t) => t.source === "vibe");
    } else if (convFilter === "invites") {
      list = list.filter((t) => t.source === "invite");
    }
    // "recent" and "all" both show everything; recent is the default order (newest first)
    return list;
  })();

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        {activeThread ? (
          <motion.div
            key="detail"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 min-h-0 flex flex-col"
          >
            <ChatDetail
              thread={activeThread}
              onBack={closeThread}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 min-h-0 flex flex-col"
          >
            <header className="pt-12 pb-4 px-5 shrink-0">
              <h1 className="font-display text-2xl font-bold text-foreground">
                Chat
              </h1>
              <p className="font-body text-[13px] text-muted-foreground mt-1">
                Click on a connection to start chatting
              </p>
            </header>

            {/* Loading skeleton */}
            {!loaded && (
              <div className="px-5 pb-3 shrink-0">
                <div className="h-3 w-24 rounded bg-muted/60 animate-pulse mb-3" />
                <div className="flex gap-3 pb-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className="h-16 w-16 rounded-full bg-muted/60 animate-pulse" />
                      <div className="h-2 w-10 rounded bg-muted/50 animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="h-px bg-border/30 mt-2" />
                <div className="space-y-3 mt-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-muted/60 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 rounded bg-muted/60 animate-pulse" />
                        <div className="h-2.5 w-40 rounded bg-muted/40 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connections Row */}
            {loaded && (
              <div className="px-5 pb-3 shrink-0">
                <h2 className="font-display text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Connections
                </h2>
                {connections.length > 0 ? (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {connections.map((thread, i) => (
                      <motion.button
                        key={thread.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        onClick={() => openThread(thread.id)}
                        className="flex flex-col items-center gap-1.5 shrink-0"
                      >
                        <div
                          className="relative rounded-full p-[2px]"
                          style={{ background: "var(--gradient-warm)" }}
                        >
                          <img
                            src={thread.photo}
                            alt={thread.name}
                            className="h-16 w-16 rounded-full object-cover border-2 border-background"
                          />
                          <div
                            className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full border-2 border-background flex items-center justify-center"
                            style={{ background: "var(--gradient-warm)" }}
                          >
                            {thread.source === "vibe" ? (
                              <HeartPulse className="h-2.5 w-2.5 text-primary-foreground" />
                            ) : (
                              <Send className="h-2.5 w-2.5 text-primary-foreground" />
                            )}
                          </div>
                        </div>
                        <span className="font-body text-[11px] text-muted-foreground max-w-[64px] truncate">
                          {thread.name.split(" ")[0]}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/discover")}
                    className="w-full rounded-2xl border border-dashed border-border/60 bg-muted/20 px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.15))" }}
                    >
                      <Send className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[13px] font-semibold text-foreground/80">
                        No connections yet
                      </p>
                      <p className="font-body text-[11px] text-muted-foreground">
                        Vibe or invite someone from Discover
                      </p>
                    </div>
                  </button>
                )}
                <div className="h-px bg-border/30 mt-2" />
              </div>
            )}

            {/* Conversations Section */}
            {loaded && (
              <>
                {conversations.length > 0 && (
                  <div className="px-5 pb-2 shrink-0">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                        Conversations
                      </h2>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-200 ${
                              convFilter === "all"
                                ? "text-muted-foreground border-border/60 bg-card/40 hover:bg-muted/40"
                                : "text-primary-foreground border-transparent"
                            }`}
                            style={
                              convFilter !== "all"
                                ? { background: "var(--gradient-warm)" }
                                : undefined
                            }
                            aria-label="Filter conversations"
                          >
                            <Filter className="h-3 w-3" />
                            {convFilter === "all"
                              ? "Filter"
                              : convFilter === "vibes"
                              ? "Vibes"
                              : convFilter === "invites"
                              ? "Invites"
                              : "Recent"}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                            Filter by
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {[
                            { key: "all", label: "All", icon: SlidersHorizontal },
                            { key: "vibes", label: "Vibes", icon: HeartPulse },
                            { key: "invites", label: "Invites", icon: Send },
                            { key: "recent", label: "Recent", icon: Clock },
                          ].map((opt) => {
                            const Icon = opt.icon;
                            const active = convFilter === opt.key;
                            return (
                              <DropdownMenuItem
                                key={opt.key}
                                onClick={() =>
                                  setConvFilter(opt.key as typeof convFilter)
                                }
                                className="flex items-center gap-2 text-[13px] cursor-pointer"
                              >
                                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="flex-1">{opt.label}</span>
                                {active && (
                                  <Check className="h-3.5 w-3.5 text-primary" />
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )}
                {conversations.length === 0 && connections.length > 0 ? (
                  <div className="px-5 pt-2">
                    <div className="rounded-2xl bg-muted/20 border border-border/40 px-4 py-5 text-center">
                      <p className="font-body text-[13px] font-semibold text-foreground/80">
                        No conversations yet
                      </p>
                      <p className="font-body text-[12px] text-muted-foreground mt-1">
                        Tap a connection above to say hi 👋
                      </p>
                    </div>
                  </div>
                ) : filteredConversations.length === 0 && conversations.length > 0 ? (
                  <div className="px-5 pt-2">
                    <div className="rounded-2xl bg-muted/20 border border-border/40 px-4 py-5 text-center">
                      <p className="font-body text-[13px] font-semibold text-foreground/80">
                        No {convFilter === "vibes" ? "vibes" : convFilter === "invites" ? "invites" : "conversations"} yet
                      </p>
                      <p className="font-body text-[12px] text-muted-foreground mt-1">
                        Try selecting a different filter
                      </p>
                    </div>
                  </div>
                ) : (
                  <ChatList
                    threads={filteredConversations}
                    onOpenThread={openThread}
                  />
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="shrink-0 bg-card/80 backdrop-blur-xl border-t border-border/30 z-30">
        <div className="flex items-center justify-around py-3 px-2">
          <NavItem icon={<Users className="h-5 w-5" />} label="Profile" onClick={() => navigate("/profile")} />
          <NavItem icon={<Sparkles className="h-5 w-5" />} label="Moments" onClick={() => navigate("/moments")} />
          <NavItem
            icon={<InfinityIcon />}
            label="Discover"
            onClick={() => navigate("/discover")}
          />
          <NavItem
            icon={<Heart className="h-5 w-5" />}
            label="Interests"
            onClick={() => navigate("/interests")}
          />
          <NavItem icon={<MessageCircle className="h-5 w-5" />} label="Chat" active />
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-200 ${
        active
          ? "text-primary scale-110"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium leading-none">{label}</span>
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"
        />
      )}
    </button>
  );
}

function InfinityIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
    </svg>
  );
}
