import { useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";

import { PROFILES } from "@/lib/profilesData";
import ProfilePhotoCard from "@/components/discover/ProfilePhotoCard";
import InterspersedPhoto from "@/components/discover/InterspersedPhoto";
import ProfileDetailsCard from "@/components/discover/ProfileDetailsCard";
import BioSection from "@/components/discover/BioSection";
import InterestsSection from "@/components/discover/InterestsSection";
import NarrativesSection from "@/components/discover/NarrativesSection";
import JoinMeForSection from "@/components/discover/JoinMeForSection";
import InviteDialog from "@/components/discover/InviteDialog";
import VibeDialog from "@/components/discover/VibeDialog";
import ProfileActions from "@/components/discover/ProfileActions";
import { addVibe } from "@/lib/vibeStore";

type VibeSection = "Photo" | "My Story" | "Interests" | "Narratives" | "Join Me For" | "Picture" | string;

const MomentProfilePreview = () => {
  const navigate = useNavigate();
  const { profileIndex } = useParams();
  const location = useLocation();
  const momentId = (location.state as { momentId?: string } | null)?.momentId;

  const idx = Math.max(0, Math.min(PROFILES.length - 1, Number(profileIndex) || 0));
  const profile = PROFILES[idx];

  const [vibedSections, setVibedSections] = useState<Set<string>>(new Set());
  const [vibeDialogOpen, setVibeDialogOpen] = useState(false);
  const [vibeDialogSection, setVibeDialogSection] = useState<VibeSection>("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<"vibe" | "invite" | null>(null);

  const goBackToMoments = useCallback(
    (removeMoment: boolean) => {
      navigate("/moments", {
        state: removeMoment && momentId ? { removeMomentId: momentId } : undefined,
        replace: true,
      });
    },
    [navigate, momentId],
  );

  const showToastThenLeave = (type: "vibe" | "invite") => {
    setActiveToast(type);
    setTimeout(() => {
      setActiveToast(null);
      goBackToMoments(true);
    }, 1200);
  };

  const openVibeDialog = (section: VibeSection) => {
    setVibeDialogSection(section);
    setVibeDialogOpen(true);
  };

  const handleSendVibe = (selectedItem?: string) => {
    setVibedSections((prev) => new Set(prev).add(vibeDialogSection));
    setVibeDialogOpen(false);
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
      idx,
      vibeDialogSection === "Picture" ? profile.photos[0] : undefined,
      snippet,
    );
    showToastThenLeave("vibe");
  };

  const handleJoinMeForVibe = (item: string) => {
    setVibedSections((prev) => new Set(prev).add("Join Me For"));
    addVibe(profile.name, profile.photos[0], "join me for", idx, undefined, item);
    showToastThenLeave("vibe");
  };

  const handleVibeToInvite = () => {
    setVibeDialogOpen(false);
    setInviteOpen(true);
  };

  const isVibed = (section: string) => vibedSections.has(section);

  const buildSections = () => {
    const detailsCard = (
      <ProfileDetailsCard
        key="details"
        profile={{
          about: profile.about,
          languages: profile.languages,
          relationshipIntent: profile.relationshipIntent,
        }}
      />
    );

    const sections = [
      <ProfilePhotoCard key="hero" src={profile.photos[0]} liked={isVibed("Picture")} onVibe={() => openVibeDialog("Picture")} profile={profile} />,
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
            <InterspersedPhoto key={`photo-${pIdx}`} src={extraPhotos[pIdx]} delay={0.2 + pIdx * 0.05} vibed={isVibed(sectionKey)} onVibe={() => openVibeDialog("Picture")} />,
          );
          photoIdx++;
        }
      });
      while (photoIdx < extraPhotos.length) {
        const pIdx = photoIdx;
        const sectionKey = `Photo-${pIdx + 2}`;
        result.push(
          <InterspersedPhoto key={`photo-${pIdx}`} src={extraPhotos[pIdx]} delay={0.2 + pIdx * 0.05} vibed={isVibed(sectionKey)} onVibe={() => openVibeDialog("Picture")} />,
        );
        photoIdx++;
      }
    }

    result.push(<ProfileActions key="actions" profileName={profile.name} />);
    return result;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Frosted top bar with Back */}
      <header className="px-4 pt-3 pb-2 sticky top-0 z-30">
        <div
          className="flex items-center justify-between rounded-2xl border border-border/30 bg-card/80 backdrop-blur-2xl px-3 py-2.5"
          style={{ boxShadow: "0 4px 32px -8px hsl(var(--foreground) / 0.06)" }}
        >
          <button
            onClick={() => goBackToMoments(false)}
            className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-muted/40 hover:scale-105 transition-all duration-200 active:scale-95"
            aria-label="Back to Moments"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
            <span className="font-body text-sm font-medium text-foreground">Back</span>
          </button>
          <span className="font-display text-sm font-semibold text-muted-foreground">Profile preview</span>
          <div className="w-12" />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={idx}
          initial={{ opacity: 0, filter: "blur(12px)", scale: 0.97 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)", scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 overflow-y-auto px-4 pb-28 space-y-5"
        >
          {buildSections()}
        </motion.main>
      </AnimatePresence>

      {/* Floating Connect button (with morph confirmation) */}
      <div className="fixed bottom-6 right-6 z-20 pointer-events-none">
        <AnimatePresence mode="wait" initial={false}>
          {activeToast ? (
            <motion.div
              key="confirm"
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
              onClick={() => setInviteOpen(true)}
              className="pointer-events-auto h-14 w-14 rounded-full flex items-center justify-center relative"
              style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
              aria-label="Send invite"
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--gradient-warm)" }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <Plus className="h-6 w-6 text-primary-foreground relative z-10" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <VibeDialog
        open={vibeDialogOpen}
        sectionName={vibeDialogSection}
        joinMeForItems={profile?.joinMeFor}
        onSendVibe={handleSendVibe}
        onCancel={() => setVibeDialogOpen(false)}
        onSendInvite={handleVibeToInvite}
      />

      <InviteDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSent={() => {
          setInviteOpen(false);
          showToastThenLeave("invite");
        }}
        profileName={profile?.name}
        profilePhoto={profile?.photos[0]}
        profileIndex={idx}
      />
    </div>
  );
};

export default MomentProfilePreview;
