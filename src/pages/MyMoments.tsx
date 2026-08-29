import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Pencil, Trash2, Ghost, RotateCcw, HeartPulse, Send, Users, Sparkles, Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { getMoodIcon, type MomentData } from "@/lib/expressionsData";
import { getMyMoments, removeMyMoment, updateMyMoment } from "@/lib/myMomentsStore";

const MOMENTS_POST_LIMIT = 5;

const MyMoments = () => {
  const navigate = useNavigate();
  const [moments, setMoments] = useState<MomentData[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const remaining = Math.max(0, MOMENTS_POST_LIMIT - moments.length);

  useEffect(() => {
    const stored = getMyMoments();
    // Demo: the oldest moment's live window has expired
    if (stored.length > 1 && !stored.some((m) => m.ended)) {
      const oldest = stored[stored.length - 1];
      const expired = { ...oldest, ended: true };
      updateMyMoment(expired);
      setMoments([...stored.slice(0, -1), expired]);
      return;
    }
    setMoments(stored);
  }, []);

  const handleRepost = (moment: MomentData) => {
    const revived = { ...moment, ended: false, timestamp: "Just now" };
    updateMyMoment(revived);
    setMoments((prev) => prev.map((m) => (m.id === moment.id ? revived : m)));
    toast.success("Moment is live again");
  };

  const handleDelete = (id: string) => {
    removeMyMoment(id);
    setMoments((prev) => prev.filter((m) => m.id !== id));
    toast.success("Moment deleted");
    setDeleteId(null);
  };

  const handleEdit = (moment: MomentData) => {
    navigate("/moments/edit", { state: { mode: "edit", moment } });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--gradient-ivory)" }}>
      {/* Header */}
      <header className="sticky top-0 z-20 pt-12 pb-4 px-5 backdrop-blur-xl bg-background/60 border-b border-border/20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/moments")}
            className="h-10 w-10 rounded-full border border-border/50 bg-card/70 flex items-center justify-center text-foreground hover:bg-card transition-colors"
            aria-label="Back to moments"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">My Moments</h1>
            <p className="text-xs text-muted-foreground font-body">
              {moments.length} {moments.length === 1 ? "moment" : "moments"} shared
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/subscribe")}
            className="shrink-0 flex items-center gap-1.5 h-9 pl-2 pr-3 rounded-full border border-primary/20 bg-card/70 backdrop-blur-sm shadow-sm"
            aria-label="Moments post balance"
          >
            <div
              className="h-5 w-5 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #E7C874, #B8892E)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              <img
                src="/__l5e/assets-v1/ef806b27-b7c5-49f7-bdef-52a0679c4a6d/sparkle-1.png"
                alt="Sparkle"
                className="h-3 w-3 object-contain"
              />
            </div>
            <span className="text-xs font-semibold text-foreground whitespace-nowrap">{remaining} left</span>
          </motion.button>

          {/* Minimized Share CTA */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate("/moments/new")}
            className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-primary-foreground shadow-md"
            style={{
              background: "var(--gradient-warm)",
              boxShadow: "0 8px 20px -6px hsl(var(--accent) / 0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
            aria-label="Share a moment"
          >
            <Plus className="h-4 w-4" strokeWidth={2.4} />
          </motion.button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pt-5 pb-28">
        {moments.length === 0 ? (
          <EmptyState onShare={() => navigate("/moments/new")} />
        ) : (
          <div className="space-y-4">
            {moments.map((moment, idx) => (
              <MyMomentCard
                key={moment.id}
                moment={moment}
                index={idx}
                onEdit={() => handleEdit(moment)}
                onDelete={() => setDeleteId(moment.id)}
                onRepost={() => handleRepost(moment)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Share CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 z-20" style={{ background: "linear-gradient(to top, hsl(var(--background)) 60%, transparent)" }}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/moments/new")}
          className="w-full h-12 rounded-full bg-foreground text-background font-body font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Share a moment
        </motion.button>
      </div>

      {/* Delete Dialog */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="relative w-full max-w-sm rounded-[28px] bg-card border border-primary/15 overflow-hidden pointer-events-auto"
                style={{
                  backgroundImage: "var(--gradient-ivory)",
                  boxShadow: "0 40px 120px -24px hsl(var(--accent) / 0.28), 0 0 0 1px hsl(var(--primary) / 0.08)",
                }}
              >
                <div className="px-6 pt-6 pb-3">
                  <h3 className="font-display text-[22px] leading-tight font-semibold text-foreground">
                    Delete this moment?
                  </h3>
                  <p className="text-[12px] text-muted-foreground font-body mt-1.5 leading-relaxed">
                    This moment will be permanently removed from your feed.
                  </p>
                </div>
                <div className="px-6 pb-6 pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 h-11 rounded-full border border-primary/20 bg-background/60 backdrop-blur-sm text-foreground text-[13px] font-body font-medium hover:bg-background transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    className="flex-1 h-11 rounded-full bg-destructive text-destructive-foreground text-[13px] font-body font-semibold hover:bg-destructive/90 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

function MyMomentCard({
  moment,
  index,
  onEdit,
  onDelete,
  onRepost,
}: {
  moment: MomentData;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onRepost: () => void;
}) {
  const MoodIcon = moment.moodTag ? getMoodIcon(moment.moodTag) : null;
  const ended = !!moment.ended;
  const seed = Array.from(moment.id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const vibeCount = seed % 9;
  const inviteCount = (seed >> 1) % 5;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[20px] border border-primary/25 p-3.5"
      style={{
        backgroundImage:
          "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(48 60% 96%) 45%, hsl(41 70% 88% / 0.75) 100%)",
        boxShadow:
          "0 24px 48px -20px hsl(var(--accent) / 0.16), 0 2px 8px -2px hsl(var(--foreground) / 0.04), inset 0 1px 0 0 hsl(var(--card) / 0.6)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9 ring-1 ring-primary/15 border border-card">
            <AvatarImage src={moment.avatar} alt={moment.name} />
            <AvatarFallback className="bg-muted text-muted-foreground font-display text-sm">
              {moment.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-[15px] font-medium text-foreground leading-none">You</p>
              {ended ? (
                <span className="inline-flex items-center gap-1.5 h-[18px] px-2 rounded-full bg-muted/70 border border-border/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-muted-foreground font-body">
                    Ended
                  </span>
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 h-[18px] px-2 rounded-full bg-primary/10 border border-primary/30"
                  style={{ boxShadow: "0 0 12px -2px hsl(var(--primary) / 0.35)" }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-70 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-primary font-body">
                    Live
                  </span>
                </span>
              )}
            </div>
            <p className="text-[9px] text-muted-foreground/80 mt-0.5 font-medium font-body uppercase tracking-wider">
              {moment.profession} • {moment.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onEdit}
            className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label="Edit moment"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Delete moment"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {moment.photo && (
        <div className="p-1.5 pb-1 bg-card border border-border/40 rounded-md mb-3">
          <img
            src={moment.photo}
            alt="Moment"
            className="w-full aspect-[4/3] object-cover rounded-sm"
            loading="lazy"
          />
        </div>
      )}

      <div className="relative">
        <span className="absolute -top-3 -left-1 text-primary/25 font-display text-4xl leading-none select-none">
          &ldquo;
        </span>
        <p className="font-body text-[13px] leading-relaxed text-foreground/80 pl-4 italic">
          {moment.text}
        </p>
      </div>

      {moment.moodTag && (
        <div className="mt-3 px-3 py-1 rounded-full bg-primary/5 border-l-2 border-primary inline-flex items-center gap-2 w-fit">
          {MoodIcon && <MoodIcon className="h-3 w-3 text-primary" />}
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em] font-body">
            {moment.moodTag}
          </span>
        </div>
      )}

      {/* Engagement received */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <div className="flex items-center gap-1.5 text-muted-foreground/60">
          <div className="h-px w-3 bg-foreground/15" />
          <span className="text-[8px] font-body font-medium uppercase tracking-[0.2em]">Received</span>
        </div>
        <div className="flex items-center gap-1.5">
          <EngagementChip icon={HeartPulse} count={vibeCount} />
          <EngagementChip icon={Send} count={inviteCount} />
        </div>
      </div>

      {ended && (
        <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground font-body leading-snug">
            This moment is no longer visible in the feed.
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onRepost}
            className="shrink-0 h-9 px-4 rounded-full text-primary-foreground text-[12px] font-body font-semibold inline-flex items-center gap-1.5"
            style={{
              background: "var(--gradient-warm)",
              boxShadow: "0 8px 20px -8px hsl(var(--accent) / 0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Repost
          </motion.button>
        </div>
      )}
    </motion.article>
  );
}

function EngagementChip({
  icon: Icon,
  count,
}: {
  icon: React.ElementType;
  count: number;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-primary/10 bg-white/40 backdrop-blur-sm"
      style={{
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px -2px hsl(var(--accent) / 0.12)",
      }}
      aria-hidden
    >
      <Icon className="h-3 w-3 text-primary/80" strokeWidth={2} />
      <span className="font-display text-[12px] font-semibold text-foreground/80 leading-none tabular-nums">
        {count}
      </span>
    </span>
  );
}

function EmptyState({ onShare }: { onShare: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/40 bg-card/60 p-8 text-center"
    >
      <div
        className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--gradient-warm)" }}
      >
        <Ghost className="h-6 w-6 text-primary-foreground" />
      </div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">No moments yet</h3>
      <p className="text-xs text-muted-foreground font-body leading-relaxed mb-5">
        Share your first moment and let people connect with you.
      </p>
      <button
        onClick={onShare}
        className="h-11 px-6 rounded-full bg-foreground text-background font-body text-sm font-semibold inline-flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Share a moment
      </button>
    </motion.div>
  );
}

export default MyMoments;
