import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, MapPin, BookOpen, Pencil, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import type { GeneratedProfile } from "@/lib/profileGenerator";

interface ProfileOutputProps {
  profile: GeneratedProfile;
  onProfileChange?: (profile: GeneratedProfile) => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

type EditTarget =
  | { type: "bio" }
  | { type: "narrative"; index: number }
  | { type: "joinMeForAll" }
  | { type: "interests" }
  | null;

const WORD_LIMITS = {
  bio: 40,
  narrativeTitle: 4,
  narrativeContent: 25,
  joinMeFor: 5,
  interest: 2,
};

// Minimums so a section can never be emptied out entirely.
const MIN_LIMITS = {
  bio: 10,
  narrativeTitle: 1,
  narrativeContent: 8,
  interests: 3,
  joinMeFor: 1,
};

const countWords = (text: string) => text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

const enforceWordLimit = (text: string, max: number) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= max) return text;
  return words.slice(0, max).join(" ");
};

const ProfileOutput = ({ profile, onProfileChange }: ProfileOutputProps) => {
  const [current, setCurrent] = useState<GeneratedProfile>(profile);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [draft, setDraft] = useState("");
  const [titleDraft, setTitleDraft] = useState("");
  const [interestsDraft, setInterestsDraft] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [joinMeForDraft, setJoinMeForDraft] = useState<string[]>([]);
  

  const update = (patch: Partial<GeneratedProfile>) => {
    const next = { ...current, ...patch };
    setCurrent(next);
    onProfileChange?.(next);
  };

  const openEdit = (target: EditTarget) => {
    if (!target) return;
    if (target.type === "bio") setDraft(current.bio);
    else if (target.type === "narrative") {
      setTitleDraft(current.narratives[target.index].title);
      setDraft(current.narratives[target.index].content);
    }
    else if (target.type === "joinMeForAll") {
      setJoinMeForDraft([...current.joinMeFor]);
    }
    else if (target.type === "interests") {
      setInterestsDraft([...current.interests]);
      setNewInterest("");
    }
    setEditTarget(target);
  };

  const saveEdit = () => {
    if (!editTarget || validationError) return;
    if (editTarget.type === "bio") update({ bio: draft });
    else if (editTarget.type === "narrative") {
      const next = [...current.narratives];
      next[editTarget.index] = { title: titleDraft, content: draft };
      update({ narratives: next });
    } else if (editTarget.type === "joinMeForAll") {
      update({ joinMeFor: joinMeForDraft.filter(Boolean) });
    } else if (editTarget.type === "interests") {
      update({ interests: interestsDraft });
    }
    setEditTarget(null);
  };

  const dialogTitle = editTarget
    ? editTarget.type === "bio" ? "Edit My Story"
    : editTarget.type === "narrative" ? "Edit Narrative"
    : editTarget.type === "joinMeForAll" ? "JOIN ME FOR"
    : "Edit Interests"
    : "";

  const isTextEdit = editTarget && editTarget.type === "bio";
  const isJoinMeForEdit = editTarget?.type === "joinMeForAll";
  const isNarrativeEdit = editTarget?.type === "narrative";

  const filledJoinMeFor = joinMeForDraft.filter((v) => v && v.trim()).length;

  const validationError: string | null = !editTarget
    ? null
    : editTarget.type === "bio"
    ? countWords(draft) < MIN_LIMITS.bio
      ? `Your story needs at least ${MIN_LIMITS.bio} words`
      : null
    : editTarget.type === "narrative"
    ? countWords(titleDraft) < MIN_LIMITS.narrativeTitle
      ? "Add a title for this narrative"
      : countWords(draft) < MIN_LIMITS.narrativeContent
      ? `This narrative needs at least ${MIN_LIMITS.narrativeContent} words`
      : null
    : editTarget.type === "interests"
    ? interestsDraft.length < MIN_LIMITS.interests
      ? `Minimum ${MIN_LIMITS.interests} interests`
      : null
    : editTarget.type === "joinMeForAll"
    ? filledJoinMeFor < MIN_LIMITS.joinMeFor
      ? "Minimum 1 experience"
      : null
    : null;

  return (
    <>
      <div className="space-y-5">
        {/* Bio */}
        <SectionCard
          icon={<Heart className="h-4.5 w-4.5 text-primary" />}
          title="My Story"
          index={0}
          onEdit={() => openEdit({ type: "bio" })}
        >
          <p className="font-body text-card-foreground/80 leading-relaxed text-[15px]">
            "{current.bio}"
          </p>
        </SectionCard>

        {/* Interests */}
        <SectionCard
          icon={<Sparkles className="h-4.5 w-4.5 text-accent" />}
          title="Interests"
          index={1}
          onEdit={() => openEdit({ type: "interests" })}
        >
          <div className="flex flex-wrap gap-2">
            {current.interests.map((interest, idx) => (
              <motion.span
                key={interest + idx}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="inline-block rounded-full border border-primary/15 bg-primary/8 px-3.5 py-1.5 font-body text-[13px] text-primary font-medium"
              >
                {interest}
              </motion.span>
            ))}
          </div>
        </SectionCard>

        {/* Narratives */}
        <SectionCard
          icon={<BookOpen className="h-4.5 w-4.5 text-primary" />}
          title="Narratives"
          index={2}
        >
          <div className="space-y-4">
            {current.narratives.map((narrative, idx) => (
              <div key={idx} className="group relative pl-4 border-l-2 border-primary/20 pr-10">
                <h4 className="font-display text-[13px] font-semibold text-foreground/70 mb-1">
                  {narrative.title}
                </h4>
                <p className="font-body text-card-foreground/75 leading-relaxed text-[15px]">
                  {narrative.content}
                </p>
                <button
                  onClick={() => openEdit({ type: "narrative", index: idx })}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-muted/60 hover:bg-muted transition-colors"
                  aria-label="Edit narrative"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Join Me For */}
        <SectionCard
          icon={<MapPin className="h-4.5 w-4.5 text-accent" />}
          title="Join Me For"
          index={3}
          onEdit={() => openEdit({ type: "joinMeForAll" })}
        >
          <div className="space-y-3">
            {current.joinMeFor.map((idea, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-display text-xs font-bold text-accent">
                  {idx + 1}
                </span>
                <p className="font-body text-card-foreground/75 text-[15px] leading-relaxed pt-0.5">
                  {idea}
                </p>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Edit Drawer */}
      <Drawer open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DrawerContent className="px-6 pb-8 pt-3 min-h-[50vh] max-h-[85vh]">
          <DrawerHeader className="px-0 pb-5">
            <DrawerTitle className="font-display text-xl">{dialogTitle}</DrawerTitle>
          </DrawerHeader>

          {isNarrativeEdit && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-body text-sm font-medium text-muted-foreground">Title</label>
                  <span className={`font-body text-xs ${countWords(titleDraft) >= WORD_LIMITS.narrativeTitle ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {countWords(titleDraft)}/{WORD_LIMITS.narrativeTitle} words
                  </span>
                </div>
                <Input
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(enforceWordLimit(e.target.value, WORD_LIMITS.narrativeTitle))}
                  className="font-body text-base rounded-xl h-12"
                  autoFocus
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-body text-sm font-medium text-muted-foreground">Content</label>
                  <span className={`font-body text-xs ${countWords(draft) >= WORD_LIMITS.narrativeContent ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {countWords(draft)}/{WORD_LIMITS.narrativeContent} words
                  </span>
                </div>
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(enforceWordLimit(e.target.value, WORD_LIMITS.narrativeContent))}
                  rows={5}
                  className="font-body text-base resize-none rounded-xl"
                />
              </div>
            </div>
          )}

          {isTextEdit && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-body text-sm font-medium text-muted-foreground">Bio</label>
                <span className={`font-body text-xs ${countWords(draft) >= WORD_LIMITS.bio ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {countWords(draft)}/{WORD_LIMITS.bio} words
                </span>
              </div>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(enforceWordLimit(e.target.value, WORD_LIMITS.bio))}
                rows={6}
                className="font-body text-base resize-none rounded-xl"
                autoFocus
              />
            </div>
          )}

          {isJoinMeForEdit && (
            <div className="space-y-5">
              <p className="font-body text-sm text-muted-foreground">Add up to 3 experiences you'd love to share</p>
              {[0, 1, 2].map((idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-body text-sm font-medium text-muted-foreground">
                      Experience {idx + 1}
                    </label>
                    <span className={`font-body text-xs ${countWords(joinMeForDraft[idx] || "") >= WORD_LIMITS.joinMeFor ? 'text-destructive' : 'text-muted-foreground/50'}`}>
                      {countWords(joinMeForDraft[idx] || "")}/{WORD_LIMITS.joinMeFor}
                    </span>
                  </div>
                  <Input
                    value={joinMeForDraft[idx] || ""}
                    onChange={(e) => {
                      const next = [...joinMeForDraft];
                      while (next.length <= idx) next.push("");
                      next[idx] = enforceWordLimit(e.target.value, WORD_LIMITS.joinMeFor);
                      setJoinMeForDraft(next);
                    }}
                    placeholder={`e.g. ${["A sunset hike", "Coffee and deep talks", "Weekend farmers market"][idx]}`}
                    className="font-body text-base rounded-xl h-12"
                  />
                </div>
              ))}
              <p className="font-body text-xs text-muted-foreground/50 text-center pt-1">
                Leave a field empty to remove it. Minimum 1 experience.
              </p>
            </div>
          )}

          {editTarget?.type === "interests" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="font-body text-sm text-muted-foreground">
                  Minimum {MIN_LIMITS.interests}, maximum 6 interests
                </p>
                <span className="font-body text-sm font-semibold text-foreground">{interestsDraft.length}/6</span>
              </div>
              <div className="flex flex-wrap gap-2.5 min-h-[48px]">
                {interestsDraft.map((interest, idx) => (
                  <span
                    key={interest + idx}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-body text-base text-primary font-medium"
                  >
                    {interest}
                    <button
                      onClick={() => {
                        if (interestsDraft.length <= MIN_LIMITS.interests) return;
                        setInterestsDraft(interestsDraft.filter((_, i) => i !== idx));
                      }}
                      disabled={interestsDraft.length <= MIN_LIMITS.interests}
                      className="hover:text-destructive transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(enforceWordLimit(e.target.value, WORD_LIMITS.interest))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newInterest.trim() && interestsDraft.length < 6) {
                        setInterestsDraft([...interestsDraft, newInterest.trim()]);
                        setNewInterest("");
                      }
                    }}
                    placeholder="Type and press Enter..."
                    className="text-base rounded-xl h-12"
                  />
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs ${countWords(newInterest) >= WORD_LIMITS.interest ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {countWords(newInterest)}/{WORD_LIMITS.interest}
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  disabled={!newInterest.trim() || interestsDraft.length >= 6}
                  onClick={() => {
                    if (newInterest.trim() && interestsDraft.length < 6) {
                      setInterestsDraft([...interestsDraft, newInterest.trim()]);
                      setNewInterest("");
                    }
                  }}
                  className="rounded-xl h-12 w-12"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {validationError && (
            <p className="font-body text-xs text-destructive text-center pt-4">
              {validationError}
            </p>
          )}

          <DrawerFooter className="px-0 pt-6 flex-row gap-3">
            <Button variant="outline" onClick={() => setEditTarget(null)} className="font-body rounded-xl flex-1 h-12 text-base">
              Cancel
            </Button>
            <Button
              onClick={saveEdit}
              disabled={!!validationError}
              className="font-body rounded-xl flex-1 h-12 text-base"
            >
              <Check className="h-5 w-5 mr-1.5" />
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

function SectionCard({
  icon,
  title,
  index,
  onEdit,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  index: number;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 relative"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60">
            {icon}
          </div>
          <h3 className="font-display text-base font-semibold text-card-foreground">{title}</h3>
        </div>
        {onEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="text-muted-foreground hover:text-foreground gap-1.5 h-8 px-2.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="text-xs">Edit</span>
          </Button>
        )}
      </div>
      {children}
    </motion.div>
  );
}

export default ProfileOutput;