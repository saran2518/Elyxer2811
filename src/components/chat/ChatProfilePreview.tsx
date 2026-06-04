import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Quote, MapPin, Shield, Globe, Sparkles, Feather, Plane, Users, Compass, Crosshair, Info } from "lucide-react";
import { useState } from "react";
import { ProfileData } from "@/lib/profilesData";

const intentIcons: Record<string, React.ReactNode> = {
  "Meaningful Connection": <Sparkles className="h-4 w-4" />,
  "Keeping it Light": <Feather className="h-4 w-4" />,
  "Travel Buddy": <Plane className="h-4 w-4" />,
  "Shared Experiences": <Users className="h-4 w-4" />,
  "Discovery Mode": <Compass className="h-4 w-4" />,
};

const tabs = [
  { key: "about", label: "About", icon: <Info className="h-3.5 w-3.5" /> },
  { key: "languages", label: "Languages", icon: <Globe className="h-3.5 w-3.5" /> },
  { key: "intent", label: "Intent", icon: <Crosshair className="h-3.5 w-3.5" /> },
] as const;

type TabKey = (typeof tabs)[number]["key"];

interface Props {
  open: boolean;
  onClose: () => void;
  profile: ProfileData | null;
  fallbackName?: string;
  fallbackPhoto?: string;
}

export default function ChatProfilePreview({ open, onClose, profile, fallbackName, fallbackPhoto }: Props) {
  const [active, setActive] = useState<TabKey>("about");

  if (!profile) {
    return createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-0 bottom-[72px] z-[60] flex flex-col bg-background"
          >
            <div
              className="shrink-0 px-4 pt-12 pb-3 flex items-center gap-3 z-10"
              style={{
                background: "linear-gradient(180deg, hsl(var(--card)) 70%, transparent)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={onClose}
                className="p-2 -ml-2 rounded-2xl hover:bg-muted/50 transition-all active:bg-muted/70"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </motion.button>
              <span className="font-display text-[15px] font-bold text-foreground">Profile</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-8 -mt-2">
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{ boxShadow: "0 12px 40px -12px hsl(var(--foreground) / 0.15)" }}
              >
                {fallbackPhoto && (
                  <img src={fallbackPhoto} alt={fallbackName || "Profile"} className="w-full aspect-[4/5] object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="rounded-2xl bg-card/75 backdrop-blur-lg px-5 py-4 border border-border/20">
                    <h2 className="font-display text-2xl font-bold text-foreground">{fallbackName}</h2>
                    <p className="font-body text-sm text-foreground/70 mt-1">No additional profile details available.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  }

  if (!profile) return null;

  const aboutItems = [
    { label: "Gender", value: profile.about.gender },
    { label: "Pronouns", value: profile.about.pronouns },
    { label: "Orientation", value: profile.about.orientation },
    { label: "Education", value: profile.about.education },
    { label: "Height", value: profile.about.height },
  ];

  const hasMultiValue = aboutItems.slice(0, 3).some((item) => item.value.includes(","));
  const topRow = hasMultiValue ? aboutItems.slice(0, 2) : aboutItems.slice(0, 3);
  const bottomRow = hasMultiValue ? aboutItems.slice(2) : aboutItems.slice(3);
  const topCols = hasMultiValue ? 2 : 3;
  const bottomCols = hasMultiValue ? 3 : 2;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex flex-col bg-background"
        >
          {/* Header */}
          <div className="shrink-0 px-4 pt-12 pb-3 flex items-center gap-3 z-10"
            style={{
              background: "linear-gradient(180deg, hsl(var(--card)) 70%, transparent)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onClose}
              className="p-2 -ml-2 rounded-2xl hover:bg-muted/50 transition-all active:bg-muted/70"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </motion.button>
            <span className="font-display text-[15px] font-bold text-foreground">Profile</span>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-5 -mt-2">
            {/* Hero Photo Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 12px 40px -12px hsl(var(--foreground) / 0.15)" }}
            >
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-full aspect-[4/5] object-cover"
                width={800}
                height={1000}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="rounded-2xl bg-card/75 backdrop-blur-lg px-5 py-4 border border-border/20">
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {profile.name}, {profile.age}
                    </h2>
                    {profile.verified && (
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <p className="font-body text-sm text-foreground/80 mt-0.5">
                    {profile.profession} • {profile.specialization}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-body text-xs text-muted-foreground">{profile.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-border/50 bg-card p-5 relative overflow-hidden"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="absolute top-0 left-0 w-1 h-full rounded-r-full" style={{ background: "var(--gradient-warm)" }} />
              <div className="flex items-start gap-3 ml-2">
                <Quote className="h-5 w-5 text-primary/40 mt-0.5 shrink-0 rotate-180" />
                <div>
                  <h3 className="font-display text-base font-semibold text-card-foreground mb-2">My Story</h3>
                  <p className="font-body text-card-foreground/80 leading-relaxed text-[15px] italic">{profile.bio}</p>
                </div>
              </div>
            </motion.div>

            {/* Details Card with Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-border/50 bg-card overflow-hidden"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex border-b border-border/30">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActive(tab.key)}
                    className={`relative flex-1 flex items-center justify-center gap-1.5 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                      active === tab.key ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {active === tab.key && (
                      <motion.div
                        layoutId="preview-tab-indicator"
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-3 min-h-[140px]">
                <AnimatePresence mode="wait">
                  {active === "about" && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-2"
                    >
                      <div className="grid gap-x-2 gap-y-3" style={{ gridTemplateColumns: `repeat(${topCols}, minmax(0, 1fr))` }}>
                        {topRow.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center text-center gap-1.5 rounded-xl border border-border/30 px-2 py-3"
                            style={{ background: "hsl(var(--muted) / 0.35)" }}
                          >
                            <span className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
                            <span className="font-body text-[12px] text-foreground font-semibold leading-tight">
                              {item.value.split(",").map(v => v.trim()).join(" · ")}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div
                        className="grid gap-x-2 gap-y-3 mx-auto"
                        style={{ gridTemplateColumns: `repeat(${bottomCols}, minmax(0, 1fr))`, maxWidth: bottomCols === 2 ? '66%' : '100%' }}
                      >
                        {bottomRow.map((item, idx) => (
                          <div
                            key={idx + topRow.length}
                            className="flex flex-col items-center text-center gap-1.5 rounded-xl border border-border/30 px-2 py-3"
                            style={{ background: "hsl(var(--muted) / 0.35)" }}
                          >
                            <span className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
                            <span className="font-body text-[12px] text-foreground font-semibold leading-tight">
                              {item.value.split(",").map(v => v.trim()).join(" · ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {active === "languages" && (
                    <motion.div
                      key="languages"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-wrap gap-2"
                    >
                      {profile.languages.map((lang, idx) => (
                        <motion.span
                          key={lang}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.06, duration: 0.3 }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border/40 px-3.5 py-2 text-[13px] font-medium text-foreground"
                          style={{ background: "hsl(var(--primary) / 0.06)" }}
                        >
                          <Globe className="h-3.5 w-3.5 text-primary/70" />
                          {lang}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}

                  {active === "intent" && (
                    <motion.div
                      key="intent"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-3"
                    >
                      {profile.relationshipIntent.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08, duration: 0.35 }}
                          className="flex items-center gap-3 rounded-xl p-3 border border-border/30"
                          style={{ background: "hsl(var(--primary) / 0.04)" }}
                        >
                          <span className="text-primary/60">{intentIcons[item] || <Sparkles className="h-4 w-4" />}</span>
                          <span className="font-body text-[14px] font-medium text-foreground/85">{item}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-border/50 bg-card p-5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <h3 className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">Interests</h3>
              <p className="font-body text-[15px] leading-relaxed text-foreground/80 font-medium">
                {profile.interests.map((interest, idx, arr) => (
                  <span key={idx}>
                    {interest}
                    {idx < arr.length - 1 && (
                      <span className="mx-2 inline-block h-[5px] w-[5px] rounded-full bg-primary/50 align-middle" />
                    )}
                  </span>
                ))}
              </p>
            </motion.div>

            {/* Narratives */}
            {profile.narratives.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-border/50 bg-card p-5 relative overflow-hidden"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="absolute top-0 left-0 w-1 h-full rounded-r-full" style={{ background: "var(--gradient-warm)" }} />
                <div className="flex items-start gap-3 ml-2">
                  <Quote className="h-5 w-5 text-primary/40 mt-0.5 shrink-0 rotate-180" />
                  <div className="flex-1">
                    <h3 className="font-display text-base font-semibold text-card-foreground mb-3">Narratives</h3>
                    <div className="space-y-0">
                      {profile.narratives.map((narrative, idx) => (
                        <div key={idx}>
                          {idx > 0 && <div className="my-4 h-px bg-border/60" />}
                          <h4 className="font-display text-[13px] font-semibold text-foreground/70 mb-1.5">{narrative.title}</h4>
                          <p className="font-body text-card-foreground/80 leading-relaxed text-[15px] italic">{narrative.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Join Me For */}
            {profile.joinMeFor.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-border/50 bg-card p-5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <MapPin className="h-5 w-5 text-primary/60 shrink-0" />
                  <h3 className="font-display text-base font-semibold text-card-foreground">Join Me For</h3>
                </div>
                <div className="space-y-2.5">
                  {profile.joinMeFor.map((idea, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/50 px-4 py-3 flex items-center gap-3"
                      style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--accent) / 0.10))" }}
                    >
                      <p className="font-body text-card-foreground/80 text-[14px] leading-snug">{idea}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Extra Photos */}
            {profile.photos.slice(1).map((photo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl overflow-hidden"
                style={{ boxShadow: "0 8px 32px -8px hsl(var(--foreground) / 0.1)" }}
              >
                <img
                  src={photo}
                  alt={`${profile.name} photo ${idx + 2}`}
                  className="w-full aspect-[4/5] object-cover"
                  loading="lazy"
                  width={800}
                  height={1000}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
