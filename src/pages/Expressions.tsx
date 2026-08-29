import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Plus,
  Heart,
  HeartPulse,
  MessageCircle,
  Users,
  X,
  Send,
  Image as ImageIcon,
  Flag,
  Eye,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
  Ghost,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MOMENTS, MOOD_TAGS, getMoodIcon, type MomentData } from "@/lib/expressionsData";
import { PROFILES } from "@/lib/profilesData";
import InviteDialog from "@/components/discover/InviteDialog";
import VibeDialog from "@/components/discover/VibeDialog";
import ReportDialog from "@/components/discover/ReportDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addVibe } from "@/lib/vibeStore";
import {
  getMyMoments,
  addMyMoment,
  updateMyMoment,
  removeMyMoment,
} from "@/lib/myMomentsStore";
const MomentSharedToast = () => (
  <motion.div
    initial={{ opacity: 0, y: 16, scale: 0.94 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.96 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center gap-3 pl-1.5 pr-5 py-1.5 rounded-full border border-primary/15 bg-card/80 backdrop-blur-xl shadow-2xl"
    style={{
      boxShadow:
        "0 24px 60px -18px hsl(var(--accent) / 0.35), 0 0 0 1px hsl(var(--primary) / 0.08)",
    }}
  >
    <div
      className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
      style={{
        background:
          "linear-gradient(135deg, #E7C874 0%, #C89B4A 55%, #A87A2D 100%)",
        boxShadow:
          "inset 0 1.5px 0 rgba(255,255,255,0.45), 0 6px 16px -4px hsl(38 60% 45% / 0.45)",
      }}
    >
      <Send className="h-[18px] w-[18px] text-white -translate-x-px" strokeWidth={2.2} />
    </div>
    <div className="flex flex-col leading-tight">
      <span className="font-display text-[15px] font-semibold text-foreground">
        Moment shared
      </span>
      <span className="text-[11px] text-muted-foreground font-body">
        Now live in your feed
      </span>
    </div>
  </motion.div>
);

const showMomentSharedToast = () => {
  toast.custom(() => <MomentSharedToast />, {
    duration: 3000,
    position: "bottom-center",
  });
};

const Expressions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [moments, setMoments] = useState<MomentData[]>(() => getMyMoments());
  const [vibed, setVibed] = useState<Set<string>>(new Set());
  const [justSharedId, setJustSharedId] = useState<string | null>(null);

  // Vibe dialog state
  const [vibeDialogOpen, setVibeDialogOpen] = useState(false);
  const [vibeTarget, setVibeTarget] = useState<MomentData | null>(null);

  // Invite state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteTarget, setInviteTarget] = useState<MomentData | null>(null);

  // Delete confirmation state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Initial load simulation
  useEffect(() => {
    const t = setTimeout(() => {
      setMoments((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const seed = MOMENTS.filter((m) => !existingIds.has(m.id));
        return [...prev, ...seed];
      });
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  // Handle moment removal after returning from profile preview (vibe/invite sent)
  useEffect(() => {
    const s = (location.state as
      | { removeMomentId?: string; newMoment?: MomentData; updatedMoment?: MomentData }
      | null) ?? null;
    if (!s) return;
    if (s.removeMomentId) {
      removeMyMoment(s.removeMomentId);
      setMoments((prev) => prev.filter((m) => m.id !== s.removeMomentId));
    }
    if (s.newMoment) {
      const n = s.newMoment;
      addMyMoment(n);
      setMoments((prev) => [n, ...prev.filter((m) => m.id !== n.id)]);
      setJustSharedId(n.id);
      showMomentSharedToast();
      setTimeout(() => setJustSharedId(null), 2000);
    }
    if (s.updatedMoment) {
      const u = s.updatedMoment;
      updateMyMoment(u);
      setMoments((prev) => prev.map((m) => (m.id === u.id ? u : m)));
      toast.success("Moment updated");
    }
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  const requestDelete = (momentId: string) => setDeleteTargetId(momentId);

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    removeMyMoment(deleteTargetId);
    setMoments((prev) => prev.filter((m) => m.id !== deleteTargetId));
    toast.success("Moment deleted");
    setDeleteTargetId(null);
  };

  const handleEditStart = (moment: MomentData) => {
    navigate("/moments/edit", { state: { mode: "edit", moment } });
  };

  const mine = moments.filter((m) => m.name === "You");
  const others = moments.filter((m) => m.name !== "You");

  const [reportOpen, setReportOpen] = useState(false);
  const handleReport = () => setReportOpen(true);

  const handleVibeClick = (moment: MomentData) => {
    setVibeTarget(moment);
    setVibeDialogOpen(true);
  };

  const handleSendVibe = () => {
    if (vibeTarget) {
      const targetId = vibeTarget.id;
      const targetName = vibeTarget.name;
      addVibe(
        targetName,
        vibeTarget.avatar,
        "moment",
        vibeTarget.profileIndex ?? 0,
        vibeTarget.photo,
        vibeTarget.text,
      );
      toast.success(`Vibe sent to ${targetName}`);
      setMoments((prev) => prev.filter((m) => m.id !== targetId));
    }
    setVibeDialogOpen(false);
    setVibeTarget(null);
  };

  const handleVibeCancel = () => {
    setVibeDialogOpen(false);
    setVibeTarget(null);
  };

  const handleVibeToInvite = () => {
    setVibeDialogOpen(false);
    if (vibeTarget) {
      setInviteTarget(vibeTarget);
      setInviteOpen(true);
    }
    setVibeTarget(null);
  };

  const handleInvite = (moment: MomentData) => {
    setInviteTarget(moment);
    setInviteOpen(true);
  };

  const handleShareClick = () => navigate("/moments/new");

  return (
    <div className="h-screen flex flex-col pb-24" style={{ background: "var(--gradient-ivory)" }}>
      {/* Sticky Header */}
      <div className="shrink-0 z-10">
        <header className="pt-12 pb-4 px-5 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Moments
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Let people connect with your moments
            </p>
          </div>

          {/* My moments profile orb */}
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate("/moments/me")}
            aria-label="My moments"
            className="relative shrink-0 rounded-full p-[2px]"
            style={{ background: "var(--gradient-gold)" }}
          >
            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-background">
              <img
                src={PROFILES[0]?.photos?.[0]}
                alt="My moments"
                className="h-full w-full object-cover"
              />
            </div>
            {mine.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center font-body border-2 border-background shadow-sm">
                {mine.length}
              </span>
            )}
          </motion.button>
        </header>

        <div className="px-4 pb-4">
          {/* Share a moment CTA — quiet, glassy */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShareClick}
            className="group relative w-full rounded-full text-left border border-border/60 bg-card/60 backdrop-blur-xl hover:bg-card/75 transition-colors"
            style={{ boxShadow: "var(--shadow-glass)" }}
          >
            <div className="relative flex items-center gap-3 rounded-full pl-4 pr-1.5 py-1.5">
              <p className="flex-1 truncate text-left">
                <span className="font-body uppercase text-foreground/70 text-[11px] font-normal tracking-[0.16em]">Share a moment</span>
              </p>
              <Sparkles className="h-3.5 w-3.5 text-primary/70 shrink-0" strokeWidth={2} />
              <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary transition-transform duration-300 group-hover:rotate-90">
                <Plus className="h-4 w-4" strokeWidth={2.4} />
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto px-4 pt-2">
        {/* Moments Feed: Loading / Empty / List */}
        {loading && moments.length === 0 ? (
          <MomentsSkeleton />
        ) : !loading && moments.length === 0 ? (
          <EmptyMoments />
        ) : (
          (() => {
            const renderCard = (moment: MomentData, idx: number) => (
              <MomentCard
                key={moment.id}
                moment={moment}
                index={idx}
                isVibed={vibed.has(moment.id)}
                isOwn={false}
                isJustShared={justSharedId === moment.id}
                onVibe={() => handleVibeClick(moment)}
                onInvite={() => handleInvite(moment)}
                onReport={() => setReportOpen(true)}
                onViewProfile={() => moment.profileIndex !== undefined ? navigate(`/moments/preview/${moment.profileIndex}`, { state: { momentId: moment.id } }) : navigate("/discover")}
                onEdit={() => handleEditStart(moment)}
                onDelete={() => requestDelete(moment.id)}
              />
            );
            return (
              <div className="space-y-6">
                {others.length > 0 && (
                  <section>
                    <SectionDivider label="AROUND YOU" />
                    <div className="space-y-5">{others.map(renderCard)}</div>
                  </section>
                )}
              </div>
            );
          })()
        )}

      </div>


      {/* Invite Dialog */}
      <InviteDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSent={() => {
          if (inviteTarget) {
            const targetId = inviteTarget.id;
            setMoments((prev) => prev.filter((m) => m.id !== targetId));
          }
          setInviteOpen(false);
          setInviteTarget(null);
        }}
        profileName={inviteTarget?.name}
        profilePhoto={inviteTarget?.avatar}
        profileIndex={inviteTarget?.profileIndex ?? 0}
      />

      {/* Vibe Dialog */}
      <VibeDialog
        open={vibeDialogOpen}
        sectionName="Moments"
        onSendVibe={handleSendVibe}
        onCancel={handleVibeCancel}
        onSendInvite={handleVibeToInvite}
      />

      {/* Report Dialog */}
      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        profileName=""
      />

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTargetId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg"
              onClick={() => setDeleteTargetId(null)}
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
                <div
                  className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-40 blur-3xl"
                  style={{ background: "var(--gradient-warm)" }}
                />
                <div
                  className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full opacity-25 blur-3xl"
                  style={{ background: "var(--gradient-gold)" }}
                />

                <div className="relative px-6 pt-6 pb-3">
                  <div className="flex items-center gap-2 text-primary/70">
                    <Trash2 className="h-3 w-3" />
                    <span className="text-[10px] font-body uppercase tracking-[0.22em]">Remove entry</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                  </div>
                  <h3 className="font-display text-[22px] leading-tight font-semibold text-foreground mt-2">
                    Delete this moment?
                  </h3>
                  <p className="text-[12px] text-muted-foreground font-body mt-1.5 leading-relaxed">
                    This moment will be permanently removed from your feed. This action can't be undone.
                  </p>
                </div>

                <div className="relative px-6 pb-6 pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setDeleteTargetId(null)}
                    className="flex-1 h-11 rounded-full border border-primary/20 bg-background/60 backdrop-blur-sm text-[13px] font-body font-medium text-foreground hover:bg-background transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 h-11 rounded-full bg-destructive text-destructive-foreground text-[13px] font-body font-semibold hover:bg-destructive/90 transition-colors shadow-[0_8px_24px_-8px_hsl(var(--destructive)/0.5)]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/30 z-30">
        <div className="flex items-center justify-around py-3 px-2">
          <NavItem icon={<Users className="h-5 w-5" />} label="Profile" onClick={() => navigate("/profile")} />
          <NavItem icon={<Sparkles className="h-5 w-5" />} label="Moments" active />
          <NavItem icon={<InfinityIcon />} label="Discover" onClick={() => navigate("/discover")} />
          <NavItem icon={<Heart className="h-5 w-5" />} label="Interests" onClick={() => navigate("/interests")} />
          <NavItem icon={<MessageCircle className="h-5 w-5" />} label="Chat" onClick={() => navigate("/chat")} />
        </div>
      </nav>
    </div>
  );
};

/* ── Moments Loading Skeleton ── */
function MomentsSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading moments">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-border/40 bg-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/* ── Section Divider ── */
function SectionDivider({ label, gold }: { label: string; gold?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 mb-3 px-1">
      <span
        className={`font-body text-[10px] uppercase tracking-[0.22em] font-semibold ${gold ? "" : "text-muted-foreground/70"}`}
        style={gold ? { background: "var(--gradient-gold)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : undefined}
      >
        {label}
      </span>
      <span
        className="h-px flex-1"
        style={{
          background: gold
            ? "linear-gradient(to right, hsl(var(--primary) / 0.45), transparent)"
            : "linear-gradient(to right, hsl(var(--border)), transparent)",
        }}
      />
    </div>
  );
}

/* ── My Moments Slider ── */
function MomentSlider({
  moments,
  renderCard,
}: {
  moments: MomentData[];
  renderCard: (moment: MomentData, idx: number) => React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const drag = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null);

  const slideWidth = () => {
    const el = scrollRef.current;
    if (!el) return 1;
    const first = el.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth : el.offsetWidth;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const index = Math.round(el.scrollLeft / slideWidth());
      setActive(Math.max(0, Math.min(index, moments.length - 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [moments.length]);

  const goTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, moments.length - 1));
    el.scrollTo({ left: clamped * slideWidth(), behavior: "smooth" });
    setActive(clamped);
  };

  // Pointer drag support (mouse / trackpad in preview)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    const d = drag.current;
    if (!el || !d) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    el.scrollLeft = d.startScroll - dx;
  };
  const onPointerUp = () => {
    const el = scrollRef.current;
    const d = drag.current;
    drag.current = null;
    if (!el || !d) return;
    goTo(Math.round(el.scrollLeft / slideWidth()));
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", touchAction: "pan-x pan-y", overscrollBehaviorX: "contain" }}
      >
        {moments.map((moment, idx) => (
          <div key={moment.id} className="w-[88%] shrink-0 snap-center pr-3 last:pr-4">
            {renderCard(moment, idx)}
          </div>
        ))}
      </div>
      {moments.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            type="button"
            aria-label="Previous moment"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className="h-7 w-7 rounded-full border border-primary/25 bg-card/70 backdrop-blur-sm flex items-center justify-center text-primary disabled:opacity-30 transition-opacity"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
          <div className="flex items-center gap-1.5">
            {moments.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to moment ${idx + 1}`}
                onClick={() => goTo(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${active === idx ? "w-4 bg-primary" : "w-1.5 bg-primary/25"}`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next moment"
            onClick={() => goTo(active + 1)}
            disabled={active === moments.length - 1}
            className="h-7 w-7 rounded-full border border-primary/25 bg-card/70 backdrop-blur-sm flex items-center justify-center text-primary disabled:opacity-30 transition-opacity"
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        </div>
      )}
    </div>
  );
}


/* ── Empty Moments State ── */
function EmptyMoments() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/40 bg-card/60 p-8 text-center"
    >
      <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--gradient-warm)" }}>
        <Ghost className="h-6 w-6 text-primary-foreground" />
      </div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">It's quiet in here…</h3>
      <p className="text-xs text-muted-foreground font-body leading-relaxed">
        No new moments yet. Check back soon
      </p>
    </motion.div>
  );
}

/* ── Moment Card ── */
function MomentCard({
  moment,
  index,
  isVibed,
  isOwn,
  isJustShared,
  onVibe,
  onInvite,
  onReport,
  onViewProfile,
  onEdit,
  onDelete,
}: {
  moment: MomentData;
  index: number;
  isVibed: boolean;
  isOwn?: boolean;
  isJustShared?: boolean;
  onVibe: () => void;
  onInvite: () => void;
  onReport: () => void;
  onViewProfile: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const rotate = index % 2 === 1 ? 1 : -1;
  const MoodIcon = moment.moodTag ? getMoodIcon(moment.moodTag) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden ${isJustShared ? "ring-2 ring-primary/30 rounded-[24px]" : "rounded-[20px]"} ${isOwn ? "border border-primary/25" : "bg-card/60 border border-border/30"} p-3.5`}
      style={{
        boxShadow: isOwn
          ? "0 24px 48px -20px hsl(var(--accent) / 0.16), 0 2px 8px -2px hsl(var(--foreground) / 0.04), inset 0 1px 0 0 hsl(var(--card) / 0.6)"
          : "0 24px 48px -20px hsl(var(--foreground) / 0.06), 0 2px 8px -2px hsl(var(--foreground) / 0.03), inset 0 1px 0 0 hsl(var(--card) / 0.6)",
        backgroundImage: isOwn
          ? "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(48 60% 96%) 45%, hsl(41 70% 88% / 0.75) 100%)"
          : undefined,
      }}
    >
      {/* Header row: avatar + name (always left-aligned) */}
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
              <p className="font-display text-[15px] font-medium text-foreground leading-none">
                {isOwn ? "You" : `${moment.name}, ${moment.age}`}
              </p>
              {isOwn ? (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/50 backdrop-blur-sm px-2 py-0.5"
                  aria-label="This moment is live"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <motion.span
                      className="absolute inset-0 rounded-full bg-primary"
                      animate={{ scale: [1, 2.6, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary font-body">Live</span>
                </span>
              ) : (
                <button
                  onClick={onViewProfile}
                  className="text-[9px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 border border-primary/25 rounded-full hover:bg-primary/5 transition-colors font-body"
                >
                  View
                </button>
              )}
            </div>

            <p className="text-[9px] text-muted-foreground/80 mt-0.5 font-medium font-body uppercase tracking-wider">
              {moment.profession} • {moment.location}
            </p>
          </div>
        </div>
        {isOwn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground/60 hover:text-foreground transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem onClick={onEdit} className="gap-2 text-sm">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="gap-2 text-sm text-destructive focus:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={onReport}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground/50 hover:text-destructive transition-colors"
            aria-label="Report moment"
          >
            <Flag className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Photo as polaroid + floating mood chip */}
      {moment.photo ? (
        <div className="relative">
          <div
            className="p-1.5 pb-1 bg-card border border-border/40 rounded-md relative z-10 w-full"
            style={{
              boxShadow: "0 20px 40px -16px hsl(30 20% 25% / 0.18), 0 2px 6px -2px hsl(30 20% 25% / 0.08)",
            }}
          >
            <img
              src={moment.photo}
              alt="Moment"
              className="w-full aspect-[4/3] object-cover rounded-sm"
              loading="lazy"
            />
          </div>


        </div>
      ) : null}

      {/* Text + action */}
      <div className={`${moment.photo ? "mt-3" : "mt-1"} px-0.5`}>

        {/* Text with decorative quote — both photo and text-only posts */}
        <div className="relative">
          <span className="absolute -top-3 -left-1 text-primary/25 font-display text-4xl leading-none select-none">“</span>
          <p className="font-body text-[13px] leading-relaxed text-foreground/80 pl-4 italic font-normal">
            {moment.text}
          </p>
        </div>

        {/* Bottom row: mood (if no photo) + heart */}
        <div className="mt-3 flex items-center justify-between gap-3">
          {moment.moodTag ? (
            <div className="px-3 py-1 rounded-full bg-primary/5 border-l-2 border-primary inline-flex items-center gap-2">
              {MoodIcon && <MoodIcon className="h-3 w-3 text-primary" />}
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em] font-body">{moment.moodTag}</span>
            </div>
          ) : (
            <span />
          )}


          {!isOwn && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onVibe}
              className={`h-9 w-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                isVibed ? "text-primary-foreground" : "bg-card border border-border/40 text-primary shadow-sm"
              }`}
              style={isVibed ? { background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" } : undefined}
              aria-label="Send vibe"
            >
              <motion.div animate={isVibed ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                <HeartPulse className="h-4 w-4" strokeWidth={1.75} />
              </motion.div>
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ── Compose Dialog ── */
function ComposeSheet({
  open,
  onClose,
  draft,
  onDraftChange,
  mood,
  onMoodChange,
  onSubmit,
  isEdit,
  submitting,
  existingPhoto,
}: {
  open: boolean;
  onClose: () => void;
  draft: string;
  onDraftChange: (v: string) => void;
  mood: string | null;
  onMoodChange: (v: string | null) => void;
  onSubmit: (photo?: string | null) => void;
  isEdit?: boolean;
  submitting?: boolean;
  existingPhoto?: string;
}) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) {
      setPhoto(null);
      setPhotoUploading(false);
    } else if (isEdit && existingPhoto) {
      setPhoto(existingPhoto);
    }
  }, [open, isEdit, existingPhoto]);
  const [showAllMoods, setShowAllMoods] = useState(false);
  const visibleMoods = showAllMoods ? MOOD_TAGS : MOOD_TAGS.slice(0, 8);

  const MOMENT_WORD_LIMIT = 25;
  const countWords = (text: string) => text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const enforceWordLimit = (text: string, max: number) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= max) return text;
    return words.slice(0, max).join(" ");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg"
            onClick={onClose}
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
              {/* Decorative gold orbs */}
              <div
                className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-40 blur-3xl"
                style={{ background: "var(--gradient-warm)" }}
              />
              <div
                className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full opacity-25 blur-3xl"
                style={{ background: "var(--gradient-gold)" }}
              />

              {/* Editorial header */}
              <div className="relative px-6 pt-6 pb-3">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/60 backdrop-blur-sm border border-border/40 flex items-center justify-center hover:bg-background transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <div className="flex items-center gap-2 text-primary/70">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-[10px] font-body uppercase tracking-[0.22em]">
                    {isEdit ? "Refine" : "A new entry"}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                </div>
                <h3 className="font-display text-[24px] leading-tight font-semibold text-foreground mt-2 italic">
                  {isEdit ? "Edit your moment" : "Share a moment"}
                </h3>
                <p className="text-[11px] text-muted-foreground font-body mt-1">
                  {isEdit ? "Polish what's already present." : "Capture what's alive in you right now."}
                </p>
              </div>

              {/* Content */}
              <div className="relative px-6 pb-6 space-y-4">
                <div className="relative rounded-[20px] border border-primary/15 bg-background/50 backdrop-blur-sm overflow-hidden">
                  <span className="absolute top-2 left-3 font-display text-4xl leading-none text-primary/30 select-none">“</span>
                  <Textarea
                    value={draft}
                    onChange={(e) => onDraftChange(enforceWordLimit(e.target.value, MOMENT_WORD_LIMIT))}
                    placeholder="A thought, a feeling, a small wonder…"
                    className="resize-none border-0 bg-transparent min-h-[110px] text-[14px] font-display italic focus-visible:ring-0 placeholder:text-muted-foreground/40 pl-8 pr-4 pt-3"
                    autoFocus
                  />
                </div>

                {/* Photo preview (polaroid style) */}
                {photoUploading && (
                  <div className="rounded-[20px] border border-primary/15 bg-background/40 h-36 flex items-center justify-center gap-2 text-muted-foreground text-xs font-body">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Developing photo…
                  </div>
                )}
                {photo && !photoUploading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-card p-2 rounded-[14px] border border-border/40"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    <img src={photo} alt="Attached" className="w-full h-36 object-cover rounded-[8px]" />
                    <button
                      onClick={() => setPhoto(null)}
                      className="absolute top-3 right-3 h-7 w-7 rounded-full bg-background/85 backdrop-blur-sm border border-border/40 flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <X className="h-3 w-3 text-foreground" />
                    </button>
                  </motion.div>
                )}

                <div className="flex items-center justify-between font-body">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPhotoUploading(true);
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setTimeout(() => {
                            setPhoto(ev.target?.result as string);
                            setPhotoUploading(false);
                          }, 600);
                        };
                        reader.readAsDataURL(file);
                      }
                      e.target.value = "";
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-[11px] text-primary rounded-full px-3 py-1.5 border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    {photo ? "Change photo" : "Attach a photo"}
                  </button>
                  <span className={`tabular-nums text-[10px] uppercase tracking-wider ${countWords(draft) > 20 ? "text-destructive font-semibold" : "text-muted-foreground/70"}`}>
                    {countWords(draft)}/{MOMENT_WORD_LIMIT} words
                  </span>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="h-px flex-1 bg-border/60" />
                  <span className="text-[9px] font-body uppercase tracking-[0.25em] text-muted-foreground/70">Mood</span>
                  <span className="h-px flex-1 bg-border/60" />
                </div>

                {/* Mood tags */}
                <motion.div layout className="flex flex-wrap gap-1.5">
                  {visibleMoods.map((tag, i) => {
                    const Icon = tag.icon;
                    const isSelected = mood === tag.label;
                    return (
                      <motion.button
                        key={tag.label}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => onMoodChange(isSelected ? null : tag.label)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-200 font-body ${
                          isSelected
                            ? "border-transparent text-primary-foreground shadow-sm"
                            : "border-primary/20 text-foreground/70 bg-background/60 hover:bg-background hover:border-primary/40"
                        }`}
                        style={isSelected ? { background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" } : undefined}
                      >
                        <Icon className="h-3 w-3" />
                        {tag.label}
                      </motion.button>
                    );
                  })}
                  {!showAllMoods && (
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setShowAllMoods(true)}
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium border border-dashed border-primary/30 text-primary/80 hover:bg-primary/5 transition-colors font-body"
                    >
                      +{MOOD_TAGS.length - 8} more
                    </motion.button>
                  )}
                </motion.div>

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSubmit(photo)}
                  disabled={!draft.trim() || submitting || photoUploading}
                  className="w-full py-3.5 rounded-[20px] text-[14px] font-semibold text-primary-foreground flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-body mt-1 tracking-wide"
                  style={{
                    background: draft.trim() ? "var(--gradient-gold)" : "hsl(var(--muted))",
                    boxShadow: draft.trim() ? "var(--shadow-elegant)" : "none",
                    color: draft.trim() ? undefined : "hsl(var(--muted-foreground))",
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isEdit ? "Saving…" : "Sharing…"}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {isEdit ? "Save changes" : "Share this moment"}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Nav helpers ── */
function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-200 ${
        active ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
    </svg>
  );
}

export default Expressions;
