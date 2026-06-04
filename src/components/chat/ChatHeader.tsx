import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, HeartPulse, Send, MoreHorizontal, X, ShieldBan, Flag, Plus } from "lucide-react";
import { ChatThread } from "@/lib/chatStore";

interface ChatHeaderProps {
  thread: ChatThread;
  onBack: () => void;
  onDateRoom: () => void;
  onMenuAction: (action: "disconnect" | "block" | "report") => void;
  onViewProfile: () => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}

export default function ChatHeader({
  thread,
  onBack,
  onDateRoom,
  onMenuAction,
  onViewProfile,
  menuOpen,
  setMenuOpen,
}: ChatHeaderProps) {
  return (
    <div className="relative z-10">
      <div
        className="px-4 pt-12 pb-3"
        style={{
          background: "linear-gradient(180deg, hsl(var(--card)) 70%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onBack}
            className="p-2 -ml-2 rounded-2xl hover:bg-muted/50 transition-all active:bg-muted/70"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onViewProfile}
            className="flex items-center gap-3 rounded-2xl hover:bg-muted/30 transition-all active:bg-muted/50"
          >
            <img
              src={thread.photo}
              alt={thread.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/15 ring-offset-2 ring-offset-background"
            />

            <div className="flex flex-col gap-0.5 min-w-0 flex-1 text-left">
              <p className="font-display text-[15px] font-bold text-foreground truncate">
                {thread.name}
              </p>
              <span
                className="self-start flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider text-primary-foreground"
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
          </motion.button>

          {/* Virtual Date Room */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onDateRoom}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl transition-all hover:bg-primary/5"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <rect x="2" y="4" width="14" height="16" rx="3" />
              <line x1="9" y1="9" x2="9" y2="15" />
              <line x1="6" y1="12" x2="12" y2="12" />
              <path d="M16 8.5l4.5-2.5v12L16 15.5" />
            </svg>
            <span className="text-[10px] font-semibold text-primary leading-tight">Virtual Date Room</span>
          </motion.button>

          {/* 3-dot menu */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-2xl hover:bg-muted/50 transition-all"
            >
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -8 }}
                    transition={{ type: "spring", damping: 25, stiffness: 400 }}
                    className="absolute right-0 top-full mt-2 z-50 w-52 rounded-2xl border border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => onMenuAction("disconnect")}
                      className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                      Close connection
                    </button>
                    <div className="h-px bg-border/20 mx-3" />
                    <button
                      onClick={() => onMenuAction("block")}
                      className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                    >
                      <ShieldBan className="h-4 w-4" />
                      Block
                    </button>
                    <div className="h-px bg-border/20 mx-3" />
                    <button
                      onClick={() => onMenuAction("report")}
                      className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <Flag className="h-4 w-4" />
                      Report
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom border glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
}
