import { useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Undo2,
  X,
  Heart,
  Sparkles,
  Users,
  MessageCircle,
  Search,
  Wand2,
  Send,
} from "lucide-react";

import paperPlaneAsset from "@/assets/paper-plane_1.png.asset.json";
import { PROFILES } from "@/lib/profilesData";
import ProfilePhotoCard from "@/components/discover/ProfilePhotoCard";
import InterspersedPhoto from "@/components/discover/InterspersedPhoto";
import ProfileDetailsCard from "@/components/discover/ProfileDetailsCard";
import BioSection from "@/components/discover/BioSection";
import InterestsSection from "@/components/discover/InterestsSection";
import NarrativesSection from "@/components/discover/NarrativesSection";
import JoinMeForSection from "@/components/discover/JoinMeForSection";
import MagicSearchFilter from "@/components/discover/MagicSearchFilter";
import InviteDialog from "@/components/discover/InviteDialog";
import VibeDialog from "@/components/discover/VibeDialog";
import ProfileActions from "@/components/discover/ProfileActions";
import { addVibe } from "@/lib/vibeStore";

type VibeSection = "Photo" | "My Story" | "Interests" | "Narratives" | "Join Me For" | string;

const Discover = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialProfile = Number(searchParams.get("profile")) || 0;
  const [currentIndex, setCurrentIndex] = useState(initialProfile);
  const [direction, setDirection] = useState(0);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);

  // Vibe state
  const [vibedSections, setVibedSections] = useState<Set<string>>(new Set());
  const [vibeDialogOpen, setVibeDialogOpen] = useState(false);
  const [vibeDialogSection, setVibeDialogSection] = useState<VibeSection>("");

  const searchResult = useMemo(() => {
    if (filterTags.length === 0) return { profiles: PROFILES, meta: new Map<string, { level: 1 | 2 | 3; matched: string[] }>() };

    // First tag = free-text magic prompt; rest = structured tags (e.g. gender)
    const [promptRaw, ...structuredTags] = filterTags;
    const STOPWORDS = new Set([
      "a","an","the","and","or","but","is","are","was","were","be","been","being",
      "of","to","in","on","for","with","at","by","from","as","that","this","these",
      "those","i","me","my","you","your","he","she","they","we","it","someone",
      "who","whom","whose","like","loves","love","into","really","very","just","also",
      "want","wants","looking","find","feels","feel","life","person","people",
    ]);
    const tokenize = (s: string) =>
      s.toLowerCase().match(/[a-z][a-z'-]{1,}/g)?.filter((t) => !STOPWORDS.has(t)) ?? [];

    const promptTokens = tokenize(promptRaw || "");
    const structuredLower = structuredTags.map((t) => t.toLowerCase());

    const scored = PROFILES.map((p, idx) => {
      const haystackParts = [
        p.bio, p.profession, p.specialization, ...p.relationshipIntent,
        ...p.interests, ...p.narratives.map((n) => n.title),
        ...p.narratives.map((n) => n.content), ...p.joinMeFor,
        ...p.languages, p.about.gender, p.about.orientation, p.location,
      ];
      const haystack = haystackParts.join(" ").toLowerCase();
      const haystackTokens = new Set(tokenize(haystack));

      // Hard filter: structured tags (e.g. gender) must match
      const passesStructured = structuredLower.every((tag) => haystack.includes(tag));
      if (!passesStructured) return null;

      // Score: token overlap + phrase bonus + interest exact bonus
      let score = 0;
      const matched = new Set<string>();
      for (const tok of promptTokens) {
        if (haystackTokens.has(tok)) {
          if (!matched.has(tok)) score += 1;
          matched.add(tok);
        } else if (haystack.includes(tok)) {
          if (!matched.has(tok)) score += 0.5;
          matched.add(tok);
        }
      }
      // Phrase bonus
      const phrase = (promptRaw || "").trim().toLowerCase();
      if (phrase && haystack.includes(phrase)) score += 3;
      // Interest exact-match bonus
      const interestsLower = p.interests.map((i) => i.toLowerCase());
      for (const tok of promptTokens) {
        if (interestsLower.some((i) => i.includes(tok))) score += 0.5;
      }

      return { profile: p, score, idx, matched: Array.from(matched) };
    }).filter((x): x is { profile: typeof PROFILES[number]; score: number; idx: number; matched: string[] } => x !== null);

    const meta = new Map<string, { level: 1 | 2 | 3; matched: string[] }>();

    // If no prompt tokens, just keep structured-filtered order
    if (promptTokens.length === 0) {
      return { profiles: scored.map((s) => s.profile), meta };
    }

    // Sort by score desc; keep all profiles (best → next best → ...)
    scored.sort((a, b) => b.score - a.score || a.idx - b.idx);

    const best = scored[0]?.score || 1;
    scored.forEach((s) => {
      // Coverage of the query terms + how close it is to the best profile in the set
      const coverage = s.matched.length / promptTokens.length;
      const relative = Math.min(1, s.score / best);
      const relevance = Math.round((coverage * 0.6 + relative * 0.4) * 100);
      const level: 1 | 2 | 3 = relevance >= 80 ? 3 : relevance >= 50 ? 2 : 1;
      meta.set(s.profile.name, { level, matched: s.matched });
    });

    return { profiles: scored.map((s) => s.profile), meta };
  }, [filterTags]);

  const filteredProfiles = searchResult.profiles;

  const reachedEnd = filteredProfiles.length > 0 && currentIndex >= filteredProfiles.length;
  const profile = filteredProfiles[currentIndex] || filteredProfiles[0];
  const relevanceInfo = profile ? searchResult.meta.get(profile.name) : undefined;


  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((i) => Math.min(i + 1, filteredProfiles.length));
    setVibedSections(new Set());
  }, [filteredProfiles.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
      setVibedSections(new Set());
    }
  }, [currentIndex]);

  const openVibeDialog = (section: VibeSection) => {
    setVibeDialogSection(section);
    setVibeDialogOpen(true);
  };

  const handleSendVibe = (selectedItem?: string) => {
    setVibedSections((prev) => new Set(prev).add(vibeDialogSection));
    setVibeDialogOpen(false);

    // Add vibe to store so it appears in Interests page
    if (profile) {
      const originalIndex = PROFILES.indexOf(profile);
      const snippet =
        vibeDialogSection === "My Story"
          ? profile.bio?.slice(0, 80)
          : vibeDialogSection === "Join Me For"
            ? selectedItem
            : undefined;
      addVibe(
        profile.name,
        profile.photos[0],
        vibeDialogSection === "Picture" ? "picture" : vibeDialogSection.toLowerCase(),
        originalIndex >= 0 ? originalIndex : currentIndex,
        vibeDialogSection === "Picture" ? profile.photos[0] : undefined,
        snippet,
      );
    }

    showToast("vibe");
    goNext();
  };

  const handleVibeToInvite = () => {
    setVibeDialogOpen(false);
    setInviteOpen(true);
  };

  const handleJoinMeForVibe = (item: string) => {
    setVibedSections((prev) => new Set(prev).add("Join Me For"));
    if (profile) {
      const originalIndex = PROFILES.indexOf(profile);
      addVibe(
        profile.name,
        profile.photos[0],
        "join me for",
        originalIndex >= 0 ? originalIndex : currentIndex,
        undefined,
        item,
      );
    }
    showToast("vibe");
    goNext();
  };

  const [activeToast, setActiveToast] = useState<"pass" | "vibe" | "invite" | null>(null);

  const showToast = (type: "pass" | "vibe" | "invite") => {
    setActiveToast(type);
    setTimeout(() => setActiveToast(null), 1200);
  };

  const handlePass = () => {
    showToast("pass");
    goNext();
  };
  const handleConnect = () => setInviteOpen(true);

  const isVibed = (section: string) => vibedSections.has(section);

  const buildSections = () => {
    // Group About + Languages + Intent together so photos don't split them
    const detailsCard = (
      <ProfileDetailsCard
        key="details"
        profile={{ about: profile.about, languages: profile.languages, relationshipIntent: profile.relationshipIntent }}
      />
    );

    const sections = [
      <ProfilePhotoCard key="hero" src={profile.photos[0]} liked={isVibed("Picture")} onVibe={() => openVibeDialog("Picture")} profile={profile} relevanceLevel={relevanceInfo?.level} />,
      <BioSection key="bio" bio={profile.bio} vibed={isVibed("My Story")} onVibe={() => openVibeDialog("My Story")} />,
      detailsCard,
      <InterestsSection key="interests" interests={profile.interests} vibed={isVibed("Interests")} onVibe={() => openVibeDialog("Interests")} />,
      <NarrativesSection key="narratives" narratives={profile.narratives} vibed={isVibed("Narratives")} onVibe={() => openVibeDialog("Narratives")} />,
      <JoinMeForSection key="joinmefor" items={profile.joinMeFor} vibed={isVibed("Join Me For")} onVibeItem={(item) => handleJoinMeForVibe(item)} />,
    ];

    const extraPhotos = profile.photos.slice(1);
    const contentSections = sections.slice(1);
    const result: React.ReactNode[] = [sections[0]];

    if (extraPhotos.length === 0) {
      result.push(...contentSections);
    } else {
      const gap = Math.max(1, Math.floor(contentSections.length / (extraPhotos.length + 1)));
      let photoIdx = 0;

      contentSections.forEach((section, i) => {
        result.push(section);
        if (photoIdx < extraPhotos.length && (i + 1) % gap === 0) {
          const pIdx = photoIdx;
          const sectionKey = `Photo-${pIdx + 2}`;
          result.push(
            <InterspersedPhoto key={`photo-${pIdx}`} src={extraPhotos[pIdx]} delay={0.2 + pIdx * 0.05} vibed={isVibed(sectionKey)} onVibe={() => openVibeDialog("Picture")} />
          );
          photoIdx++;
        }
      });

      while (photoIdx < extraPhotos.length) {
        const pIdx = photoIdx;
        const sectionKey = `Photo-${pIdx + 2}`;
        result.push(
          <InterspersedPhoto key={`photo-${pIdx}`} src={extraPhotos[pIdx]} delay={0.2 + pIdx * 0.05} vibed={isVibed(sectionKey)} onVibe={() => openVibeDialog("Picture")} />
        );
        photoIdx++;
      }
    }

    // Add Report & Block at the very bottom
    result.push(<ProfileActions key="actions" profileName={profile.name} />);

    return result;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Frosted top bar */}
      <header className="px-4 pt-3 pb-2 sticky top-0 z-30">
        <div
          className="flex items-center justify-between rounded-2xl border border-border/30 bg-card/80 backdrop-blur-2xl px-4 py-2.5"
          style={{ boxShadow: "0 4px 32px -8px hsl(var(--foreground) / 0.06)" }}
        >
          <MagicSearchFilter onApply={(tags) => { setFilterTags(tags); setCurrentIndex(0); setVibedSections(new Set()); }}>
            <button className="p-1.5 rounded-xl hover:bg-muted/40 hover:scale-105 transition-all duration-200 relative active:scale-95">
              <SlidersHorizontal className="h-5 w-5 text-foreground" />
              {filterTags.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center"
                >
                  {filterTags.length}
                </motion.span>
              )}
            </button>
          </MagicSearchFilter>

          <MagicSearchFilter onApply={(tags) => { setFilterTags(tags); setCurrentIndex(0); setVibedSections(new Set()); }}>
            <button className="font-body text-sm font-medium text-muted-foreground flex items-center gap-1.5 hover:text-foreground transition-colors group">
              <Wand2 className="h-3.5 w-3.5 text-primary group-hover:rotate-12 transition-transform duration-300" />
              Magic Search
            </button>
          </MagicSearchFilter>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentIndex === 0}
              className="p-1.5 rounded-xl hover:bg-muted/40 hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              onClick={goPrev}
              aria-label="Undo last action"
            >
              <Undo2 className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      {filteredProfiles.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-16 w-16 rounded-2xl bg-muted/60 flex items-center justify-center"
          >
            <Search className="h-7 w-7 text-muted-foreground/40" />
          </motion.div>
          <div className="space-y-1">
            <p className="font-display text-lg font-semibold text-foreground">No profiles found</p>
            <p className="font-body text-sm text-muted-foreground">Try different keywords or reset your filters</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setFilterTags([]); setCurrentIndex(0); }}
            className="px-5 py-2 rounded-full text-[13px] font-body font-medium text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
          >
            Clear filters
          </motion.button>
        </div>
      ) : reachedEnd ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-16 w-16 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
          >
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </motion.div>
          <div className="space-y-1">
            <p className="font-display text-lg font-semibold text-foreground">You've seen everyone</p>
            <p className="font-body text-sm text-muted-foreground max-w-[260px]">
              Check back soon for new profiles, or refine your search to discover more people.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentIndex(0)}
              className="px-5 py-2 rounded-full text-[13px] font-body font-medium text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
            >
              Start over
            </motion.button>
            {filterTags.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setFilterTags([]); setCurrentIndex(0); }}
                className="px-5 py-2 rounded-full text-[13px] font-body font-medium text-primary-foreground"
                style={{ background: "var(--gradient-warm)" }}
              >
                Clear filters
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.main
            key={currentIndex}
            initial={{ opacity: 0, filter: "blur(12px)", scale: 0.97 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(12px)", scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 overflow-y-auto px-4 pb-28 space-y-5"
          >
            {buildSections()}
          </motion.main>
        </AnimatePresence>
      )}

      {/* Floating action buttons (with inline morph confirmation) */}
      {!reachedEnd && filteredProfiles.length > 0 && (
      <div className="fixed bottom-20 left-0 right-0 flex items-center justify-between px-6 pointer-events-none z-20">
        {/* Pass */}
        <AnimatePresence mode="wait" initial={false}>
          {activeToast === "pass" ? (
            <motion.div
              key="pass-confirm"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
              className="pointer-events-none flex items-center gap-2 h-14 px-5 rounded-full bg-card border border-destructive/30"
              style={{ boxShadow: "0 10px 32px -8px hsl(var(--destructive) / 0.35)" }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 400, damping: 18 }}
                className="h-7 w-7 rounded-full bg-destructive/10 flex items-center justify-center"
              >
                <X className="h-4 w-4 text-destructive" strokeWidth={3} />
              </motion.div>
              <span className="font-display text-sm font-semibold text-foreground">Passed</span>
            </motion.div>
          ) : (
            <motion.button
              key="pass-btn"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.08 }}
              onClick={handlePass}
              className="pointer-events-auto h-14 w-14 rounded-full border border-border/50 bg-card/95 backdrop-blur-md flex items-center justify-center group"
              style={{ boxShadow: "0 8px 32px -6px hsl(var(--foreground) / 0.1)" }}
            >
              <X className="h-6 w-6 text-muted-foreground group-hover:text-destructive transition-colors duration-200" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Connect / Confirm */}
        <AnimatePresence mode="wait" initial={false}>
          {activeToast === "vibe" || activeToast === "invite" ? (
            <motion.div
              key="connect-confirm"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
              className="pointer-events-none flex items-center gap-2 h-14 px-5 rounded-full text-primary-foreground"
              style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 400, damping: 18 }}
                className="h-7 w-7 rounded-full bg-primary-foreground/20 flex items-center justify-center"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <span className="font-display text-sm font-semibold">
                {activeToast === "vibe" ? "Vibe sent" : "Invite sent"}
              </span>
            </motion.div>
          ) : (
            <motion.button
              key="connect-btn"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.08 }}
              onClick={handleConnect}
              className="pointer-events-auto h-14 w-14 rounded-full flex items-center justify-center relative"
              style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--gradient-warm)" }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <img
                src={inviteAsset.url}
                alt="Connect"
                className="h-6 w-6 relative z-10"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      )}

      {/* Vibe Dialog */}
      <VibeDialog
        open={vibeDialogOpen}
        sectionName={vibeDialogSection}
        joinMeForItems={profile?.joinMeFor}
        onSendVibe={handleSendVibe}
        onCancel={() => setVibeDialogOpen(false)}
        onSendInvite={handleVibeToInvite}
      />

      {/* Invite Dialog */}
      <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} onSent={() => { setInviteOpen(false); showToast("invite"); goNext(); }} profileName={profile?.name} profilePhoto={profile?.photos[0]} profileIndex={PROFILES.indexOf(profile)} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/85 backdrop-blur-2xl border-t border-border/20 z-30">
        <div className="flex items-center justify-around py-2.5 px-4 max-w-md mx-auto">
          <NavItem icon={<Users className="h-5 w-5" />} label="Profile" onClick={() => navigate("/profile")} />
          <NavItem icon={<Sparkles className="h-5 w-5" />} label="Moments" onClick={() => navigate("/moments")} />
          <NavItem icon={<InfinityIcon />} label="Discover" active />
          <NavItem icon={<Heart className="h-5 w-5" />} label="Interests" onClick={() => navigate("/interests")} />
          <NavItem icon={<MessageCircle className="h-5 w-5" />} label="Chat" onClick={() => navigate("/chat")} />
        </div>
      </nav>
    </div>
  );
};

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-300 ${
        active ? "text-primary" : "text-muted-foreground/60 hover:text-foreground active:scale-90"
      }`}
    >
      <motion.div
        animate={active ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <span className={`text-[10px] font-medium leading-none ${active ? "font-semibold" : ""}`}>{label}</span>
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-5 rounded-full"
          style={{ background: "var(--gradient-warm)" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
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

export default Discover;
