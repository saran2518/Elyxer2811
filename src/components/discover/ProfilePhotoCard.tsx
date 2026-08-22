import { motion } from "framer-motion";
import { HeartPulse, Home, MapPin, Shield, Wand2 } from "lucide-react";
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
    hometown: string;
  };
  relevanceLevel?: 1 | 2 | 3;
  showLocation?: boolean;
}

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

const HorizontalSparkleDots = ({ level }: { level: 1 | 2 | 3 }) => (
  <div className="flex items-center gap-1.5">
    {[0, 1, 2].map((i) => {
      // Fill from left to right like a battery charge indicator
      const active = i < level;
      return (
        <motion.div
          key={i}
          initial={false}
          animate={active ? { scale: [1, 1.25, 1] } : { scale: 1 }}
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
              className="absolute inset-0 rounded-full blur-[4px] opacity-50"
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

const CelestialRingsOrb = ({ level }: { level: 1 | 2 | 3 }) => {
  // Three arc segments around the orb; active count matches the relevance level.
  const segments = [
    { d: "M 47 26 A 21 21 0 0 1 36.5 44.1", rotate: 0 },
    { d: "M 26 47 A 21 21 0 0 1 5.5 30.5", rotate: 120 },
    { d: "M 7.5 19.5 A 21 21 0 0 1 31.5 5.5", rotate: 240 },
  ];

  return (
    <div className="relative w-[52px] h-[52px] flex items-center justify-center rounded-full bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl overflow-visible">
      {/* Golden glow underlay */}
      <div
        className="absolute inset-0 rounded-full blur-lg scale-110 opacity-60"
        style={{ backgroundColor: "hsl(var(--primary) / 0.22)" }}
      />

      {/* Segmented ring meter */}
      <svg className="absolute inset-0 w-full h-full -rotate-90 overflow-visible" viewBox="0 0 52 52">
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F5E6AD" />
          </linearGradient>
        </defs>

        {/* Track ring */}
        <circle
          cx="26"
          cy="26"
          r="21"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          className="opacity-10"
          strokeDasharray="38 5"
        />

        {/* Active segments */}
        {segments.map((seg, i) => {
          const active = i < level;
          return (
            <motion.path
              key={i}
              d={seg.d}
              fill="none"
              stroke={active ? "url(#gold-gradient)" : "white"}
              strokeWidth={active ? 3 : 2.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: active ? 1 : 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
              style={{
                filter: active ? "drop-shadow(0 0 6px rgba(251,191,36,0.55))" : "none",
              }}
            />
          );
        })}
      </svg>

      {/* Magic wand icon */}
      <motion.div
        animate={{ rotate: [0, 6, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <Wand2 className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={1.75} />
      </motion.div>
    </div>
  );
};

export default function ProfilePhotoCard({ src, liked, onVibe, profile, relevanceLevel, showLocation = true }: Props) {
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
        className="absolute top-4 right-4 h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-20"
        style={{ backgroundColor: liked ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.25)" }}
      >
        <motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
          <HeartPulse className="h-5 w-5 text-white" strokeWidth={2} />
        </motion.div>
      </motion.button>

      {/* Magic Search relevance indicator — floating frosted orb with curved meter sparkles */}
      {relevanceLevel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="absolute top-4 left-4 z-20 h-[52px] w-[52px] rounded-full border border-primary/30 flex flex-col items-center justify-center pt-1"
          style={{
            background:
              "linear-gradient(145deg, hsl(var(--primary) / 0.22) 0%, hsl(var(--card) / 0.82) 55%, hsl(var(--primary) / 0.12) 100%)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 8px 28px -8px hsl(var(--primary) / 0.35), inset 0 1px 1px hsl(var(--background) / 0.35)",
          }}
        >
          <CurvedMeterSparkles level={relevanceLevel} />
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wand2 className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={2} />
          </motion.div>
        </motion.div>
      )}

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
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1">
            {showLocation && (
              <>
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-body text-xs text-muted-foreground whitespace-nowrap">{profile.location}</span>
                <span className="font-body text-xs text-muted-foreground/60">·</span>
              </>
            )}
            <Home className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="font-body text-xs text-muted-foreground whitespace-nowrap">{profile.hometown}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
