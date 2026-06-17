import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MOOD_TAGS, type MomentData } from "@/lib/expressionsData";

type ComposeState = {
  mode?: "create" | "edit";
  moment?: MomentData;
};

const MOMENT_WORD_LIMIT = 25;
const countWords = (text: string) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
const enforceWordLimit = (text: string, max: number) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= max) return text;
  return words.slice(0, max).join(" ");
};

const MomentCompose = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ComposeState | null) ?? {};
  const isEdit = state.mode === "edit" && !!state.moment;
  const existing = state.moment;

  const [draft, setDraft] = useState(existing?.text ?? "");
  const [mood, setMood] = useState<string | null>(existing?.moodTag ?? null);
  const [photo, setPhoto] = useState<string | null>(existing?.photo ?? null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => navigate("/moments");

  const handleSubmit = async () => {
    if (!draft.trim() || submitting || photoUploading) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    if (isEdit && existing) {
      navigate("/moments", {
        state: {
          updatedMoment: {
            ...existing,
            text: draft.trim(),
            moodTag: mood ?? "",
            photo: photo ?? undefined,
            timestamp: "Just now",
          },
        },
      });
    } else {
      const newMoment: MomentData = {
        id: `m-${Date.now()}`,
        name: "You",
        age: 25,
        profession: "Explorer",
        location: "Here",
        avatar: "",
        text: draft.trim(),
        photo: photo ?? undefined,
        moodTag: mood ?? "",
        timestamp: "Just now",
      };
      navigate("/moments", { state: { newMoment } });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col pb-28 overflow-hidden">
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-[100px] opacity-40"
        style={{ background: "var(--gradient-warm)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -left-24 h-64 w-64 rounded-full blur-[110px] opacity-25"
        style={{ background: "var(--gradient-gold)" }}
      />

      {/* Header */}
      <header className="relative z-10 pt-12 pb-4 px-5 flex items-center justify-between">
        <button
          onClick={handleClose}
          aria-label="Back"
          className="h-9 w-9 rounded-xl bg-muted/50 backdrop-blur-md border border-border/40 flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <div className="flex items-center gap-1.5 text-primary/70">
          <Sparkles className="h-3 w-3" />
          <span className="text-[10px] font-body uppercase tracking-[0.22em]">
            {isEdit ? "Refine" : "A new entry"}
          </span>
        </div>
        <div className="h-9 w-9" />
      </header>

      <div className="relative z-10 px-5 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-[28px] leading-tight font-semibold text-foreground"
        >
          {isEdit ? (
            <>
              Edit your{" "}
              <span
                className="italic text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-warm)" }}
              >
                Moment
              </span>
            </>
          ) : (
            <>
              Share a{" "}
              <span
                className="italic text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-warm)" }}
              >
                Moment
              </span>
            </>
          )}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-[13px] text-muted-foreground font-body mt-1"
        >
          {isEdit
            ? "Polish what's already present."
            : "Capture what's alive in you right now."}
        </motion.p>

        <div className="mt-6 space-y-5">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="relative rounded-[22px] border border-border/50 bg-card/70 backdrop-blur-xl overflow-hidden focus-within:border-primary/40 transition-colors"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <span className="absolute top-1 left-3 font-display text-5xl leading-none text-primary/25 select-none pointer-events-none">
              "
            </span>
            <Textarea
              value={draft}
              onChange={(e) =>
                setDraft(enforceWordLimit(e.target.value, MOMENT_WORD_LIMIT))
              }
              placeholder="A thought, a feeling, a small wonder…"
              className="resize-none border-0 bg-transparent min-h-[140px] text-[15px] font-display italic focus-visible:ring-0 placeholder:text-muted-foreground/40 pl-9 pr-16 pt-4"
              autoFocus
            />
            {/* Word progress ring */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <div className="relative h-8 w-8">
                <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    opacity="0.4"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    fill="none"
                    stroke="url(#wordRing)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 13}
                    strokeDashoffset={
                      2 * Math.PI * 13 *
                      (1 - Math.min(countWords(draft) / MOMENT_WORD_LIMIT, 1))
                    }
                    style={{ transition: "stroke-dashoffset 0.3s ease" }}
                  />
                  <defs>
                    <linearGradient id="wordRing" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold tabular-nums text-foreground/80">
                  {MOMENT_WORD_LIMIT - countWords(draft)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Photo */}
          {photoUploading && (
            <div className="rounded-[20px] border border-border/50 bg-card h-44 flex items-center justify-center gap-2 text-muted-foreground text-xs font-body">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Developing photo…
            </div>
          )}
          {photo && !photoUploading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-card p-2 rounded-[16px] border border-border/40"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <img
                src={photo}
                alt="Attached"
                className="w-full h-56 object-cover rounded-[10px]"
              />
              <button
                onClick={() => setPhoto(null)}
                className="absolute top-3 right-3 h-7 w-7 rounded-full bg-background/85 backdrop-blur-sm border border-border/40 flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="h-3 w-3 text-foreground" />
              </button>
            </motion.div>
          )}

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

          {!photo && !photoUploading && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-[20px] border-2 border-dashed border-border/60 bg-card/40 backdrop-blur-md py-6 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-card/70 transition-all group"
            >
              <div
                className="h-11 w-11 rounded-full flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform"
                style={{
                  background: "var(--gradient-warm)",
                  boxShadow: "var(--shadow-warm)",
                }}
              >
                <ImageIcon className="h-5 w-5" />
              </div>
              <span className="text-[12px] font-body text-foreground/70">
                Attach a photo
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
                Optional
              </span>
            </motion.button>
          )}

          {/* Divider */}
          <div className="flex items-center gap-2 pt-3">
            <span className="h-px flex-1 bg-border/60" />
            <span className="text-[9px] font-body uppercase tracking-[0.25em] text-muted-foreground/70">
              Select your Mood
            </span>
            <span className="h-px flex-1 bg-border/60" />
          </div>

          {/* Moods — stylized grid */}
          <motion.div layout className="grid grid-cols-3 gap-2">
            {MOOD_TAGS.map((tag, i) => {
              const Icon = tag.icon;
              const isSelected = mood === tag.label;
              return (
                <motion.button
                  key={tag.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.025, duration: 0.25 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setMood(isSelected ? null : tag.label)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-[16px] border p-2 transition-all duration-200 ${
                    isSelected
                      ? "border-transparent text-primary-foreground shadow-sm"
                      : "border-border/50 bg-card/60 backdrop-blur-md text-foreground/70 hover:border-primary/30 hover:bg-card"
                  }`}
                  style={
                    isSelected
                      ? {
                          background: "var(--gradient-warm)",
                          boxShadow: "var(--shadow-warm)",
                        }
                      : undefined
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[9px] font-medium font-body leading-tight text-center">
                    {tag.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Sticky submit bar */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-6 pt-8 z-20 bg-gradient-to-t from-background via-background/95 to-transparent">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!draft.trim() || submitting || photoUploading}
          className="w-full py-3.5 rounded-[20px] text-[14px] font-semibold text-primary-foreground flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-body tracking-wide"
          style={{
            background: draft.trim()
              ? "var(--gradient-gold)"
              : "hsl(var(--muted))",
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

  );
};

export default MomentCompose;
