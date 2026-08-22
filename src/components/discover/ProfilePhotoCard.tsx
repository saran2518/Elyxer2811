import { motion } from "framer-motion";
import { HeartPulse, Home, MapPin, Shield, Sparkles } from "lucide-react";

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

const RelevanceTalisman = ({ level }: { level: 1 | 2 | 3 }) => {
  return (
    <div className="relative flex flex-col items-center gap-2 w-11 py-3 rounded-full bg-white/10 border border-white/30 shadow-[0_8px_28px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl overflow-hidden">
      {/* Warm glow underlay */}
      <div
        className="absolute inset-0 opacity-40 blur-md scale-125"
        style={{ background: "radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.45), transparent 70%)" }}
      />

      {/* Glass sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none" />

      {/* Magic sparkle icon */}
      <motion.div
        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <Sparkles className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={1.75} />
      </motion.div>

      {/* Stacked relevance pips */}
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        {[0, 1, 2].map((i) => {
          const active = i < level;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={active ? { scale: [1, 1.2, 1], opacity: 1 } : { scale: 1, opacity: 0.22 }}
              transition={{
                duration: level === 3 ? 0.9 : level === 2 ? 1.2 : 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.12,
              }}
              className="relative h-2 w-2 rounded-full"
              style={{
                background: active
                  ? "linear-gradient(135deg, hsl(var(--primary-glow)), hsl(var(--primary)))"
                  : "hsl(var(--primary-foreground) / 0.35)",
                boxShadow: active ? "0 0 8px hsl(var(--primary) / 0.75)" : "none",
              }}
            />
          );
        })}
      </div>
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

      {/* Magic Search relevance indicator — celestial golden rings orb */}
      {relevanceLevel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="absolute top-4 left-4 z-20"
        >
          <CelestialRingsOrb level={relevanceLevel} />
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
