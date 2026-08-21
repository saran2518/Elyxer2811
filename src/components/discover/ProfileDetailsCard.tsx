import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, MessageSquare, GraduationCap, Ruler, Heart,
  Feather, Plane, Users, Compass, Sparkles, Globe,
  Info, Languages as LanguagesIcon, Crosshair,
} from "lucide-react";
import meaningfulConnectionIcon from "@/assets/meaningful-connection.png";

const intentIcons: Record<string, React.ReactNode> = {
  "Meaningful Connection": <img src={meaningfulConnectionIcon} alt="Meaningful Connection" className="h-4 w-4" style={{ filter: "brightness(0) saturate(100%) invert(50%) sepia(80%) saturate(500%) hue-rotate(340deg) brightness(95%)", opacity: 0.6 }} />,
  "Keeping it Light": <Feather className="h-4 w-4" />,
  "Travel Buddy": <Plane className="h-4 w-4" />,
  "Shared Experiences": <Users className="h-4 w-4" />,
  "Discovery Mode": <Compass className="h-4 w-4" />,
};

interface Props {
  profile: {
    about: { gender: string; pronouns: string; orientation: string; education: string; height: string };
    languages: string[];
    relationshipIntent: string[];
  };
}

const tabs = [
  { key: "about", label: "About", icon: <Info className="h-3.5 w-3.5" /> },
  { key: "languages", label: "Languages", icon: <LanguagesIcon className="h-3.5 w-3.5" /> },
  { key: "intent", label: "Intent", icon: <Crosshair className="h-3.5 w-3.5" /> },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function ProfileDetailsCard({ profile }: Props) {
  const [active, setActive] = useState<TabKey>("about");

  const aboutItems = [
    { icon: <User className="h-4 w-4" />, label: "Gender", value: profile.about.gender },
    { icon: <MessageSquare className="h-4 w-4" />, label: "Pronouns", value: profile.about.pronouns },
    { icon: <Heart className="h-4 w-4" />, label: "Orientation", value: profile.about.orientation },
    { icon: <GraduationCap className="h-4 w-4" />, label: "Education", value: profile.about.education },
    { icon: <Ruler className="h-4 w-4" />, label: "Height", value: profile.about.height },
  ];

  // Check if any of the first 3 items have multiple values (comma-separated)
  const hasMultiValue = aboutItems.slice(0, 3).some(
    (item) => item.value.includes(",")
  );

  // Dynamic layout: 2+3 if multi-value detected, otherwise 3+2
  const topRow = hasMultiValue ? aboutItems.slice(0, 2) : aboutItems.slice(0, 3);
  const bottomRow = hasMultiValue ? aboutItems.slice(2) : aboutItems.slice(3);
  const topCols = hasMultiValue ? 2 : 3;
  const bottomCols = hasMultiValue ? 3 : 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border/50 bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Tab bar */}
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
                layoutId="tab-indicator"
                className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
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
              <div
                className="grid gap-x-2 gap-y-3"
                style={{ gridTemplateColumns: `repeat(${topCols}, minmax(0, 1fr))` }}
              >
                {topRow.map((item, idx) => (
                  <AboutItem key={idx} item={item} delay={idx * 0.05} />
                ))}
              </div>
              <div
                className="grid gap-x-2 gap-y-3 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${bottomCols}, minmax(0, 1fr))`,
                  maxWidth: bottomCols === 2 ? '66%' : '100%',
                }}
              >
                {bottomRow.map((item, idx) => (
                  <AboutItem key={idx + topRow.length} item={item} delay={(idx + topRow.length) * 0.05} />
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
                  <span className="text-primary/60">
                    {intentIcons[item] || <Sparkles className="h-4 w-4" />}
                  </span>
                  <span className="font-body text-[14px] font-medium text-foreground/85">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AboutItem({ item, delay }: { item: { icon: React.ReactNode; label: string; value: string }; delay: number }) {
  const values = item.value.split(",").map((v) => v.trim());
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="flex flex-col items-center text-center gap-1.5 rounded-xl border border-border/30 px-2 py-3"
      style={{ background: "hsl(var(--muted) / 0.35)" }}
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full text-primary"
        style={{ background: "hsl(var(--primary) / 0.10)" }}
      >
        {React.cloneElement(item.icon as React.ReactElement, { className: "h-3.5 w-3.5" })}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
        <span className="font-body text-[12px] text-foreground font-semibold leading-tight">
          {values.join(" · ")}
        </span>
      </div>
    </motion.div>
  );
}
