import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Inbox,
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
import InviteDialog from "@/components/discover/InviteDialog";
import VibeDialog from "@/components/discover/VibeDialog";
import ReportDialog from "@/components/discover/ReportDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Expressions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [moments, setMoments] = useState<MomentData[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [composeDraft, setComposeDraft] = useState("");
  const [composeMood, setComposeMood] = useState<string | null>(null);
  const [vibed, setVibed] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [justSharedId, setJustSharedId] = useState<string | null>(null);

  // Vibe dialog state
  const [vibeDialogOpen, setVibeDialogOpen] = useState(false);
  const [vibeTarget, setVibeTarget] = useState<MomentData | null>(null);

  // Invite state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteTarget, setInviteTarget] = useState<MomentData | null>(null);

  // Edit state
  const [editingMoment, setEditingMoment] = useState<MomentData | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [editMood, setEditMood] = useState<string | null>(null);

  // Delete confirmation state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Initial load simulation
  useEffect(() => {
    const t = setTimeout(() => {
      setMoments(MOMENTS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const requestDelete = (momentId: string) => setDeleteTargetId(momentId);

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    setMoments((prev) => prev.filter((m) => m.id !== deleteTargetId));
    toast.success("Moment deleted");
    setDeleteTargetId(null);
  };

  const handleEditStart = (moment: MomentData) => {
    setEditingMoment(moment);
    setEditDraft(moment.text);
    setEditMood(moment.moodTag);
    setShowCompose(false);
  };

  const handleEditSave = async () => {
    if (!editingMoment || !editDraft.trim() || !editMood) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setMoments((prev) =>
      prev.map((m) =>
        m.id === editingMoment.id
          ? { ...m, text: editDraft.trim(), moodTag: editMood, timestamp: "Just now" }
          : m
      )
    );
    setSubmitting(false);
    setEditingMoment(null);
    setEditDraft("");
    setEditMood(null);
    toast.success("Moment updated");
  };

  const [reportOpen, setReportOpen] = useState(false);
  const handleReport = () => setReportOpen(true);

  const handleVibeClick = (moment: MomentData) => {
    setVibeTarget(moment);
    setVibeDialogOpen(true);
  };

  const handleSendVibe = () => {
    if (vibeTarget) {
      setVibed((prev) => {
        const next = new Set(prev);
        next.add(vibeTarget.id);
        return next;
      });
      toast.success(`Vibe sent to ${vibeTarget.name}`);
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

  const handleShareMoment = async () => {
    if (!composeDraft.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const newMoment: MomentData = {
      id: `m-${Date.now()}`,
      name: "You",
      age: 25,
      profession: "Explorer",
      location: "Here",
      avatar: "",
      text: composeDraft.trim(),
      moodTag: composeMood ?? "",
      timestamp: "Just now",
    };
    setMoments([newMoment, ...moments]);
    setComposeDraft("");
    setComposeMood(null);
    setShowCompose(false);
    setSubmitting(false);
    setJustSharedId(newMoment.id);
    toast.success("Moment shared");
    setTimeout(() => setJustSharedId(null), 2000);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--gradient-ivory)" }}>
      {/* Editorial Header */}
      <div className="sticky top-0 z-20 bg-background/70 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="h-9 w-9" />
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground leading-none">Moments</h1>
            <p className="text-[10px] text-muted-foreground font-body mt-1.5 uppercase tracking-[0.2em]">The art of the present</p>
          </div>
          <div className="h-9 w-9" />
        </div>
      </div>

      <div className="px-4 pt-6">
        {/* Share a moment CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCompose(true)}
          className="group relative w-full overflow-hidden rounded-[24px] p-[1.5px] text-left mb-12"
          style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
        >
          {/* Inner frosted surface */}
          <div className="relative rounded-[22px] bg-card/90 backdrop-blur-xl p-5 overflow-hidden">
            {/* Soft gradient wash */}
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(120% 80% at 0% 0%, hsl(var(--primary) / 0.10), transparent 55%), radial-gradient(120% 80% at 100% 100%, hsl(var(--primary) / 0.08), transparent 60%)",
              }}
            />
            {/* Animated shine sweep */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(var(--primary-foreground) / 0.18), transparent)",
              }}
              animate={{ x: ["0%", "420%"] }}
              transition={{ duration: 3.6, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
            />

            <div className="relative flex items-center gap-4">
              <motion.div
                className="relative h-12 w-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
              >
                <Plus className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-[15px] font-semibold text-foreground tracking-tight">
                  Share a moment
                </p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  Something that feels present right now.
                </p>
              </div>
              <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center transition-all group-hover:bg-primary/20 group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4 text-primary" strokeWidth={2.2} />
              </div>
            </div>
          </div>
        </motion.button>

        {/* Moments Feed: Loading / Empty / List */}
        {loading ? (
          <MomentsSkeleton />
        ) : moments.length === 0 ? (
          <EmptyMoments onShare={() => setShowCompose(true)} />
        ) : (
          <div className="space-y-5">
            {moments.map((moment, idx) => (
              <MomentCard
                key={moment.id}
                moment={moment}
                index={idx}
                isVibed={vibed.has(moment.id)}
                isOwn={moment.name === "You"}
                isJustShared={justSharedId === moment.id}
                onVibe={() => handleVibeClick(moment)}
                onInvite={() => handleInvite(moment)}
                onReport={() => setReportOpen(true)}
                onViewProfile={() => navigate(moment.profileIndex !== undefined ? `/discover?profile=${moment.profileIndex}` : "/discover")}
                onEdit={() => handleEditStart(moment)}
                onDelete={() => requestDelete(moment.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Compose Sheet */}
      <ComposeSheet
        open={showCompose}
        onClose={() => { setShowCompose(false); setComposeDraft(""); setComposeMood(null); }}
        draft={composeDraft}
        onDraftChange={setComposeDraft}
        mood={composeMood}
        onMoodChange={setComposeMood}
        onSubmit={handleShareMoment}
        submitting={submitting}
      />

      {/* Edit Compose Sheet */}
      <ComposeSheet
        open={!!editingMoment}
        onClose={() => { setEditingMoment(null); setEditDraft(""); setEditMood(null); }}
        draft={editDraft}
        onDraftChange={setEditDraft}
        mood={editMood}
        onMoodChange={setEditMood}
        onSubmit={handleEditSave}
        submitting={submitting}
        isEdit
      />

      {/* Invite Dialog */}
      <InviteDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSent={() => setInviteOpen(false)}
        profileName={inviteTarget?.name}
        profilePhoto={inviteTarget?.avatar}
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
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this moment?</AlertDialogTitle>
            <AlertDialogDescription>
              This moment will be permanently removed from your feed. This action can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

/* ── Empty Moments State ── */
function EmptyMoments({ onShare }: { onShare: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/40 bg-card/60 p-8 text-center"
    >
      <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--gradient-warm)" }}>
        <Inbox className="h-6 w-6 text-primary-foreground" />
      </div>
      <h3 className="font-display text-base font-semibold text-foreground mb-1">No moments yet</h3>
      <p className="text-xs text-muted-foreground font-body mb-5 leading-relaxed">
        When you or others share something present, it'll appear here. Start by sharing a thought, photo, or mood.
      </p>
      <button
        onClick={onShare}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-primary-foreground"
        style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
      >
        <Plus className="h-4 w-4" />
        Share your first moment
      </button>
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
      className={`relative ${isJustShared ? "ring-2 ring-primary/30 rounded-[28px]" : "rounded-[24px]"} bg-card/60 border border-border/30 p-5`}
      style={{ boxShadow: "0 24px 48px -20px hsl(var(--foreground) / 0.06), 0 2px 8px -2px hsl(var(--foreground) / 0.03), inset 0 1px 0 0 hsl(var(--card) / 0.6)" }}
    >
      {/* Header row: avatar + name (always left-aligned) */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-1 ring-primary/15 border border-card">
            <AvatarImage src={moment.avatar} alt={moment.name} />
            <AvatarFallback className="bg-muted text-muted-foreground font-display text-sm">
              {moment.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-[17px] font-medium text-foreground leading-none">
                {isOwn ? "You" : `${moment.name}, ${moment.age}`}
              </p>
              {!isOwn && (
                <button
                  onClick={onViewProfile}
                  className="text-[9px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 border border-primary/25 rounded-full hover:bg-primary/5 transition-colors font-body"
                >
                  View
                </button>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground/80 mt-1 font-medium font-body uppercase tracking-wider">
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
            className="p-2 pb-2 bg-card border border-border/40 rounded-md relative z-10 w-full"
            style={{
              boxShadow: "0 20px 40px -16px hsl(30 20% 25% / 0.18), 0 2px 6px -2px hsl(30 20% 25% / 0.08)",
            }}
          >
            <img
              src={moment.photo}
              alt="Moment"
              className="w-full aspect-[4/5] object-cover rounded-sm"
              loading="lazy"
            />
          </div>


        </div>
      ) : null}

      {/* Text + action */}
      <div className={`${moment.photo ? "mt-6" : "mt-2"} px-1`}>

        {moment.photo ? (
          <p className="font-body text-[15px] leading-relaxed text-foreground/80 italic">
            {moment.text}
          </p>
        ) : (
          <div className="relative">
            <span className="absolute -top-3 -left-1 text-primary/25 font-display text-5xl leading-none select-none">“</span>
            <p className="font-body text-[15px] leading-relaxed text-foreground/80 pl-5 italic font-normal">
              {moment.text}
            </p>
          </div>
        )}

        {/* Bottom row: mood (if no photo) + heart */}
        <div className="mt-5 flex items-center justify-between gap-3">
          {moment.moodTag ? (
            <div className="px-3.5 py-1.5 rounded-full bg-primary/5 border-l-2 border-primary inline-flex items-center gap-2">
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
              className={`h-11 w-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                isVibed ? "text-primary-foreground" : "bg-card border border-border/40 text-primary shadow-sm"
              }`}
              style={isVibed ? { background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" } : undefined}
              aria-label="Send vibe"
            >
              <motion.div animate={isVibed ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                <HeartPulse className="h-5 w-5" strokeWidth={1.75} />
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
}: {
  open: boolean;
  onClose: () => void;
  draft: string;
  onDraftChange: (v: string) => void;
  mood: string | null;
  onMoodChange: (v: string | null) => void;
  onSubmit: () => void;
  isEdit?: boolean;
  submitting?: boolean;
}) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAllMoods, setShowAllMoods] = useState(false);
  const visibleMoods = showAllMoods ? MOOD_TAGS : MOOD_TAGS.slice(0, 8);

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
                    onChange={(e) => onDraftChange(e.target.value)}
                    placeholder="A thought, a feeling, a small wonder…"
                    className="resize-none border-0 bg-transparent min-h-[110px] text-[14px] font-display italic focus-visible:ring-0 placeholder:text-muted-foreground/40 pl-8 pr-4 pt-3"
                    maxLength={300}
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
                    initial={{ rotate: -2, opacity: 0, y: 8 }}
                    animate={{ rotate: -1.5, opacity: 1, y: 0 }}
                    className="relative bg-card p-2 pb-6 rounded-[14px] border border-border/40"
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
                  <span className={`tabular-nums text-[10px] uppercase tracking-wider ${draft.length > 250 ? "text-destructive font-semibold" : "text-muted-foreground/70"}`}>
                    {draft.length}/300
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
                  onClick={onSubmit}
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
