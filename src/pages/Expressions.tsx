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
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCompose(true)}
          className="w-full rounded-[20px] border border-primary/20 bg-card p-5 text-left transition-all hover:border-primary/40 mb-12"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="h-11 w-11 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
            >
              <Plus className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-body text-[15px] font-semibold text-foreground">Share a moment</p>
              <p className="text-xs text-muted-foreground font-body mt-0.5">Something that feels present right now.</p>
            </div>
          </div>
        </motion.button>

        {/* Moments Feed: Loading / Empty / List */}
        {loading ? (
          <MomentsSkeleton />
        ) : moments.length === 0 ? (
          <EmptyMoments onShare={() => setShowCompose(true)} />
        ) : (
          <div className="space-y-16">
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
  const isReversed = index % 2 === 1;
  const rotate = isReversed ? 1 : -1;
  const MoodIcon = moment.moodTag ? getMoodIcon(moment.moodTag) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${isJustShared ? "ring-2 ring-primary/30 rounded-3xl p-2 -m-2" : ""}`}
    >
      {/* Header row: avatar + name (alternates side) */}
      <div className={`flex items-center justify-between mb-5 ${isReversed ? "flex-row-reverse" : ""}`}>
        <div className={`flex items-center gap-3 ${isReversed ? "flex-row-reverse text-right" : ""}`}>
          <Avatar className="h-10 w-10 ring-1 ring-primary/15 border border-card">
            <AvatarImage src={moment.avatar} alt={moment.name} />
            <AvatarFallback className="bg-muted text-muted-foreground font-display text-sm">
              {moment.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className={`flex items-center gap-2 ${isReversed ? "flex-row-reverse" : ""}`}>
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
        <div className={`relative ${isReversed ? "flex justify-end" : ""}`}>
          <div
            className="p-3 pb-10 bg-card border border-border/40 rounded-sm relative z-10"
            style={{
              transform: `rotate(${rotate}deg)`,
              boxShadow: "0 20px 40px -16px hsl(30 20% 25% / 0.18), 0 2px 6px -2px hsl(30 20% 25% / 0.08)",
              width: "92%",
            }}
          >
            <img
              src={moment.photo}
              alt="Moment"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
          </div>

          {moment.moodTag && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.04 }}
              className={`absolute -bottom-3 z-30 ${isReversed ? "right-6" : "left-6"}`}
            >
              <div className="backdrop-blur-md bg-card/80 border border-primary/20 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <span className="text-primary text-[10px] italic font-display">mood</span>
                {MoodIcon && <MoodIcon className="h-3 w-3 text-primary" />}
                <span className="text-[11px] font-bold text-foreground/80 uppercase tracking-wider font-body">{moment.moodTag}</span>
              </div>
            </motion.div>
          )}
        </div>
      ) : null}

      {/* Text + action */}
      <div className={`${moment.photo ? "mt-8" : "mt-2"} px-1`}>
        {moment.photo ? (
          <p className="font-body text-[15px] leading-relaxed text-foreground/80 italic">
            {moment.text}
          </p>
        ) : (
          <div className="relative">
            <span className="absolute -top-3 -left-1 text-primary/25 font-display text-5xl leading-none select-none">“</span>
            <p className="font-display text-[19px] leading-relaxed text-foreground pl-5 italic font-normal">
              {moment.text}
            </p>
          </div>
        )}

        {/* Bottom row: mood (if no photo) + heart */}
        <div className="mt-5 flex items-center justify-between gap-3">
          {!moment.photo && moment.moodTag ? (
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
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-sm rounded-3xl bg-card border border-border/20 overflow-hidden pointer-events-auto"
              style={{ boxShadow: "0 32px 100px -20px hsl(var(--foreground) / 0.2), 0 0 0 1px hsl(var(--border) / 0.1)" }}
            >
              {/* Gradient accent bar */}
              <div className="h-1 w-full" style={{ background: "var(--gradient-warm)" }} />

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="h-9 w-9 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--gradient-warm)" }}
                  >
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </motion.div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">{isEdit ? "Edit Moment" : "Share a Moment"}</h3>
                    <p className="text-[10px] text-muted-foreground font-body">{isEdit ? "Update your moment" : "Express what's present right now"}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-full bg-muted/40 flex items-center justify-center hover:bg-muted/70 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 pb-5 space-y-3.5">
                <div className="relative">
                  <Textarea
                    value={draft}
                    onChange={(e) => onDraftChange(e.target.value)}
                    placeholder="What's alive in you right now?"
                    className="resize-none rounded-2xl border-border/30 bg-muted/10 min-h-[100px] text-sm font-body focus:border-primary/30 placeholder:text-muted-foreground/40 pr-4"
                    maxLength={300}
                    autoFocus
                  />
                </div>

                {/* Photo preview / uploading */}
                {photoUploading && (
                  <div className="rounded-2xl border border-border/30 bg-muted/10 h-36 flex items-center justify-center gap-2 text-muted-foreground text-xs font-body">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading photo…
                  </div>
                )}
                {photo && !photoUploading && (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img src={photo} alt="Attached" className="w-full h-36 object-cover rounded-2xl" />
                    <button
                      onClick={() => setPhoto(null)}
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground/60 font-body">
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
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-xl px-2.5 py-1.5 hover:bg-muted/30"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-[11px]">{photo ? "Change photo" : "Add photo"}</span>
                  </button>
                  <span className={`tabular-nums text-[11px] ${draft.length > 250 ? "text-destructive font-medium" : ""}`}>
                    {draft.length}/300
                  </span>
                </div>

                {/* Mood tags */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[11px] font-medium text-muted-foreground font-body uppercase tracking-wider">Tag your mood</p>
                    {mood && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[10px] text-primary font-medium font-body"
                      >
                        ✓ Selected
                      </motion.span>
                    )}
                  </div>
                  <motion.div layout className="flex flex-wrap gap-1.5">
                    {visibleMoods.map((tag, i) => {
                      const Icon = tag.icon;
                      const isSelected = mood === tag.label;
                      return (
                        <motion.button
                          key={tag.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.02 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onMoodChange(isSelected ? null : tag.label)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition-all duration-200 font-body ${
                            isSelected
                              ? "border-primary/40 text-primary bg-primary/10 shadow-sm shadow-primary/10"
                              : "border-border/30 text-muted-foreground bg-muted/10 hover:border-border/50 hover:bg-muted/30"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {tag.label}
                        </motion.button>
                      );
                    })}
                    {!showAllMoods && (
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setShowAllMoods(true)}
                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium border border-dashed border-border/40 text-muted-foreground hover:text-foreground hover:border-border/60 transition-colors font-body"
                      >
                        +{MOOD_TAGS.length - 8} more
                      </motion.button>
                    )}
                  </motion.div>
                </div>

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onSubmit}
                  disabled={!draft.trim() || submitting || photoUploading}
                  className="w-full py-3 rounded-2xl text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-body mt-1"
                  style={{
                    background: draft.trim() ? "var(--gradient-warm)" : "hsl(var(--muted))",
                    boxShadow: draft.trim() ? "var(--shadow-warm)" : "none",
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
                      <Send className="h-4 w-4" />
                      {isEdit ? "Save Changes" : "Share Moment"}
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
