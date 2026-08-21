import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfilePhotoCard from "@/components/discover/ProfilePhotoCard";
import InterspersedPhoto from "@/components/discover/InterspersedPhoto";
import BioSection from "@/components/discover/BioSection";
import ProfileDetailsCard from "@/components/discover/ProfileDetailsCard";
import InterestsSection from "@/components/discover/InterestsSection";
import NarrativesSection from "@/components/discover/NarrativesSection";
import JoinMeForSection from "@/components/discover/JoinMeForSection";
import type { GeneratedProfile } from "@/lib/profileGenerator";
import { PROFILES } from "@/lib/profilesData";

const noop = () => {};

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const generatedProfile = location.state?.profile as GeneratedProfile | undefined;
  const selfView = location.state?.selfView as boolean | undefined;
  const template = PROFILES[0];

  // Build profile data from either generated profile or user's own data
  const profile: GeneratedProfile | null = generatedProfile ?? (selfView ? {
    bio: template.bio,
    interests: template.interests,
    narratives: template.narratives,
    joinMeFor: template.joinMeFor,
  } as GeneratedProfile : null);

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-5 p-8"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-display text-xl font-semibold text-foreground">No profile to preview</p>
          <Button onClick={() => navigate(-1)} className="font-body" size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  const sections = [
    <ProfilePhotoCard
      key="hero"
      src={template.photos[0]}
      liked={false}
      onVibe={noop}
      profile={{
        name: template.name,
        age: template.age,
        verified: template.verified,
        profession: template.profession,
        specialization: template.specialization,
        location: template.location,
      }}
    />,
    <BioSection key="bio" bio={profile.bio} vibed={false} onVibe={noop} />,
    <ProfileDetailsCard
      key="details"
      profile={{ about: template.about, languages: template.languages, hometown: template.hometown, relationshipIntent: template.relationshipIntent }}
    />,
    <InterestsSection key="interests" interests={profile.interests} vibed={false} onVibe={noop} />,
    <NarrativesSection key="narratives" narratives={profile.narratives} vibed={false} onVibe={noop} />,
    <JoinMeForSection key="joinmefor" items={profile.joinMeFor} vibed={false} onVibeItem={noop} />,
  ];

  const extraPhotos = template.photos.slice(1);
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
        result.push(
          <InterspersedPhoto key={`photo-${photoIdx}`} src={extraPhotos[photoIdx]} delay={0.2 + photoIdx * 0.05} vibed={false} onVibe={noop} />
        );
        photoIdx++;
      }
    });

    while (photoIdx < extraPhotos.length) {
      result.push(
        <InterspersedPhoto key={`photo-${photoIdx}`} src={extraPhotos[photoIdx]} delay={0.2 + photoIdx * 0.05} vibed={false} onVibe={noop} />
      );
      photoIdx++;
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2">
        <div
          className="flex items-center gap-3 rounded-full border border-border/40 bg-card/70 backdrop-blur-xl px-4 py-2.5"
          style={{ boxShadow: "0 4px 24px -4px hsl(var(--foreground) / 0.06)" }}
        >
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 rounded-full h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-display text-base font-semibold text-foreground">Profile Preview</span>
        </div>
      </header>

      <main className="flex-1 px-4 pb-8 space-y-5 mt-2">
        {result}
      </main>
    </div>
  );
};

export default Preview;
