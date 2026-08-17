import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, MapPin, Shield, Wand2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import sparkleAsset from "@/assets/sparkle-1.png.asset.json";

interface Props {
  src: string;
  liked: boolean;
  onVibe: () => void;
  profile: {
    name: string;
    age: number;
    verified: boolean;
    profession: string;
    specialization: string;
    location: string;
  };
  relevanceLevel?: 1 | 2 | 3;
}

const TOOLTIP_MESSAGES: Record<1 | 2 | 3, string> = {
  1: "A few beautiful threads connect your worlds — every great story starts somewhere.",
  2: "Your worlds share a lovely rhythm — worth exploring further.",
  3: "Your paths seem beautifully aligned — like a verse written in the same key.",
};

const SparkleDots = ({ level }: { level: 1 | 2 | 3 }) => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map((i) => {
      const active = i < level;
      return (
        <motion.div
          key={i}
          initial={false}
          animate={active ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{
            duration: level === 3 ? 0.9 : level === 2 ? 1.2 : 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.12,
          }}
          className="relative h-3 w-3"
        >
          {active && (
            <span
              className="absolute inset-0 rounded-full blur-[4px] opacity-45"
              style={{ backgroundColor: "hsl(var(--primary))" }}
            />
          )}
          <div
            className="relative h-3 w-3"
            style={{
              WebkitMaskImage: `url(${sparkleAsset.url})`,
              maskImage: `url(${sparkleAsset.url})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              backgroundColor: "hsl(var(--primary))",
              opacity: active ? 1 : 0.18,
            }}
          />
        </motion.div>
      );
    })}
  </div>
);

export default function ProfilePhotoCard({ src, liked, onVibe, profile, relevanceLevel }: Props) {
  const [showTip, setShowTip] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revealTip = () => {
    setShowTip(true);
    if (tipTimer.current) clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => setShowTip(false), 4200);
  };

  const hideTip = () => {
    if (tipTimer.current) clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => setShowTip(false), 180);
  };

  useEffect(() => {
    return () => {
      if (tipTimer.current) clearTimeout(tipTimer.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden"
      style={{ boxShadow: "0 12px 40px -12px hsl(var(--foreground) / 0.15)" }}
    >
      <img src={src} alt="Profile" className="w-full aspect-[4/5] object-cover" width={800} height={1000} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onVibe}
        className="absolute top-4 right-4 h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
        style={{ backgroundColor: liked ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.25)" }}
      >
        <motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
          <HeartPulse className="h-5 w-5 text-white" strokeWidth={2} />
        </motion.div>
      </motion.button>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="rounded-2xl bg-card/75 backdrop-blur-lg px-5 py-4 border border-border/20">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-2xl font-bold text-foreground">{profile.name}, {profile.age}</h2>
            {profile.verified && (
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
            )}
          </div>
          <p className="font-body text-sm text-foreground/80 mt-0.5">{profile.profession} • {profile.specialization}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-body text-xs text-muted-foreground">{profile.location}</span>
          </div>

          {relevanceLevel && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="mt-2.5 flex items-center"
            >
              <div
                className="relative inline-flex"
                onMouseEnter={revealTip}
                onMouseLeave={hideTip}
                onClick={revealTip}
                onTouchStart={revealTip}
              >
                <div
                  className="flex items-center gap-2 rounded-full border border-primary/25 px-3 py-1.5 backdrop-blur-md cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--primary) / 0.14) 0%, hsl(var(--card) / 0.72) 100%)",
                    boxShadow: "0 4px 18px -4px hsl(var(--primary) / 0.14)",
                  }}
                >
                  <Wand2 className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                  <SparkleDots level={relevanceLevel} />
                </div>

                <AnimatePresence>
                  {showTip && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-0 bottom-full mb-2.5 z-20 w-56"
                    >
                      <div
                        className="relative rounded-2xl border border-primary/20 px-4 py-3 backdrop-blur-xl"
                        style={{
                          background:
                            "linear-gradient(145deg, hsl(var(--card) / 0.96) 0%, hsl(var(--primary) / 0.10) 100%)",
                          boxShadow: "0 10px 34px -8px hsl(var(--primary) / 0.22)",
                        }}
                      >
                        <p className="font-body text-xs leading-relaxed text-foreground/90">
                          {TOOLTIP_MESSAGES[relevanceLevel]}
                        </p>
                        <div
                          className="absolute left-5 -bottom-1.5 h-3 w-3 rotate-45 rounded-sm border-r border-b border-primary/20"
                          style={{
                            background:
                              "linear-gradient(-45deg, hsl(var(--card) / 0.96) 50%, hsl(var(--primary) / 0.10) 100%)",
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
