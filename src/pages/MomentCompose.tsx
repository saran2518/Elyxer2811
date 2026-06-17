import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  X,
  Image as ImageIcon,
  Camera,
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
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
    <div className="min-h-screen w-full bg-background flex flex-col pb-24">
      {/* Header */}
      <header className="pt-12 pb-4 px-5 flex items-center justify-between">
        <button
          onClick={handleClose}
          aria-label="Back"
          className="h-9 w-9 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
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

      <div className="px-5 pb-6">
        <h1 className="font-display text-[26px] leading-tight font-semibold text-foreground">
          {isEdit ? (
            <>
              Edit your{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-warm)" }}
              >
                Moment
              </span>
            </>
          ) : (
            <>
              Share a{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-warm)" }}
              >
                Moment
              </span>
            </>
          )}
        </h1>
        <p className="text-[13px] text-muted-foreground font-body mt-1">
          {isEdit
            ? "Polish what's already present."
            : "Capture what's alive in you right now."}
        </p>

        <div className="mt-6 space-y-4">
          {/* Text */}
          <div className="relative rounded-[20px] border border-border/50 bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <span className="absolute top-2 left-3 font-display text-4xl leading-none text-primary/20 select-none">
              “
            </span>
            <Textarea
              value={draft}
              onChange={(e) =>
                setDraft(enforceWordLimit(e.target.value, MOMENT_WORD_LIMIT))
              }
              placeholder="A thought, a feeling, a small wonder…"
              className="resize-none border-0 bg-transparent min-h-[140px] text-[15px] font-display italic focus-visible:ring-0 placeholder:text-muted-foreground/40 pl-8 pr-4 pt-3"
              autoFocus
            />
          </div>

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
              className="relative bg-card p-2 rounded-[14px] border border-border/40"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <img
                src={photo}
                alt="Attached"
                className="w-full h-56 object-cover rounded-[8px]"
              />
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
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-[11px] text-primary rounded-full px-3 py-1.5 border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Gallery
              </button>
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-[11px] text-primary rounded-full px-3 py-1.5 border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <Camera className="h-3.5 w-3.5" />
                Camera
              </button>
            </div>
            <span
              className={`tabular-nums text-[10px] uppercase tracking-wider ${
                countWords(draft) > 20
                  ? "text-destructive font-semibold"
                  : "text-muted-foreground/70"
              }`}
            >
              {countWords(draft)}/{MOMENT_WORD_LIMIT} words
            </span>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 pt-2">
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
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setMood(isSelected ? null : tag.label)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-[16px] border p-2 transition-all duration-200 ${
                    isSelected
                      ? "border-transparent text-primary-foreground shadow-sm"
                      : "border-border/50 bg-card text-foreground/70 hover:border-primary/30"
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
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-6 pt-4 bg-background border-t border-border/30 z-20">
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
