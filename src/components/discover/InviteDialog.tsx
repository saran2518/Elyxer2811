import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, UtensilsCrossed, Film, Video, Footprints, Plane, PawPrint, MoreHorizontal, X, Send, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { addInvite } from "@/lib/inviteStore";

const INVITE_TYPES = [
  { label: "Coffee", icon: Coffee, emoji: "☕" },
  { label: "Dinner", icon: UtensilsCrossed, emoji: "🍽️" },
  { label: "Movie", icon: Film, emoji: "🎬" },
  { label: "Virtual Date", icon: Video, emoji: "💻" },
  { label: "A Long Walk", icon: Footprints, emoji: "🌿" },
  { label: "Travel", icon: Plane, emoji: "✈️" },
  { label: "Pet Play Date", icon: PawPrint, emoji: "🐾" },
  { label: "Other", icon: MoreHorizontal, emoji: "✨" },
] as const;

interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
  onSent?: () => void;
  profileName?: string;
  profilePhoto?: string;
  profileIndex?: number;
}

export default function InviteDialog({ open, onClose, onSent, profileName, profilePhoto, profileIndex = 0 }: InviteDialogProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleInvite = () => {
    if (selected && profileName) {
      addInvite(profileName, profilePhoto || "", selected, message, profileIndex);
    }
    setSelected(null);
    setMessage("");
    onSent ? onSent() : onClose();
  };

  const handleCancel = () => {
    setSelected(null);
    setMessage("");
    onClose();
  };

  const chipVariants = {
    idle: { scale: 1 },
    tap: { scale: 0.93 },
    selected: { scale: 1.04 },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md"
            onClick={handleCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.92 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-20 z-50 rounded-3xl border border-border/30 bg-card/95 backdrop-blur-xl overflow-hidden"
            style={{ boxShadow: "0 -12px 60px -12px hsl(var(--primary) / 0.15), 0 0 0 1px hsl(var(--primary) / 0.05)" }}
          >
            {/* Decorative top gradient line */}
            <div className="h-1 w-full" style={{ background: "var(--gradient-warm)" }} />

            <div className="p-5 pt-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-base font-semibold text-card-foreground">
                    Send an Invite
                  </h3>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleCancel}
                  className="h-8 w-8 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </motion.button>
              </div>
              {profileName && (
                <p className="text-sm text-muted-foreground mb-4 font-body">
                  What would you like to do with <span className="text-foreground font-medium">{profileName}</span>?
                </p>
              )}

              {/* Invite type grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {INVITE_TYPES.map(({ label, icon: Icon, emoji }, idx) => {
                  const isActive = selected === label;
                  return (
                    <motion.button
                      key={label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx, duration: 0.3 }}
                      variants={chipVariants}
                      whileTap="tap"
                      onClick={() => setSelected(isActive ? null : label)}
                      className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl text-xs font-medium transition-all duration-200 border ${
                        isActive
                          ? "border-primary/60 text-card-foreground"
                          : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                      style={isActive ? {
                        background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.15))",
                        boxShadow: "0 4px 16px -4px hsl(var(--primary) / 0.2)",
                      } : {
                        background: "hsl(var(--muted) / 0.3)",
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="invite-glow"
                          className="absolute inset-0 rounded-2xl border-2 border-primary/40"
                          transition={{ duration: 0.25 }}
                        />
                      )}
                      <span className="text-lg leading-none">{emoji}</span>
                      <span className="font-body">{label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Message */}
              <div className="relative mb-4">
                <Textarea
                  placeholder="Say something nice… (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none rounded-2xl border-border/40 bg-muted/20 text-sm min-h-[68px] pr-10 focus:border-primary/40 font-body"
                  maxLength={200}
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-muted-foreground/50 font-body">
                  {message.length}/200
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCancel}
                  className="flex-1 py-3 rounded-2xl border border-border/50 bg-muted/30 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors font-body"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleInvite}
                  disabled={!selected}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-body"
                  style={{
                    background: selected ? "var(--gradient-warm)" : "hsl(var(--muted))",
                    boxShadow: selected ? "var(--shadow-warm)" : "none",
                    color: selected ? undefined : "hsl(var(--muted-foreground))",
                  }}
                >
                  <Send className="h-4 w-4" />
                  Send Invite
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
