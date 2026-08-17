import { motion } from "framer-motion";
import { HeartPulse, MapPin, Shield, Wand2 } from "lucide-react";
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

const VerticalSparkleDots = ({ level }: { level: 1 | 2 | 3 }) => (
  <div className="flex flex-col items-center gap-2.5">
    {[0, 1, 2].map((i) => {
      // Fill from the bottom up like a battery charge indicator
      const active = i >= 3 - level;
      return (
        <motion.div
          key={i}
          initial={false}
          animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{
            duration: level === 3 ? 0.9 : level === 2 ? 1.2 : 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.12,
          }}
          className="relative h-5 w-5"
        >
          {active && (
            <>
              <span
                className="absolute -inset-1.5 rounded-full blur-[8px] opacity-90"
                style={{ backgroundColor: "hsl(var(--primary-glow))" }}
              />
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: "0 0 10px 2px hsl(var(--primary-foreground) / 0.45)",
                }}
              />
            </>
          )}
          <div
            className="relative h-5 w-5"
            style={{
              WebkitMaskImage: `url(${sparkleAsset.url})`,
              maskImage: `url(${sparkleAsset.url})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              backgroundColor: active ? "hsl(var(--primary-foreground))" : "hsl(var(--primary-foreground) / 0.55)",
              opacity: active ? 1 : 0.75,
            }}
          />
        </motion.div>
      );
    })}
  </div>
);

export default function ProfilePhotoCard({ src, liked, onVibe, profile, relevanceLevel }: Props) {
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

      {/* Vertical Magic Search relevance rail */}
      {relevanceLevel && (
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="absolute right-3 top-20 z-10"
        >
          {/* Strong dark backing so rail stays readable on any photo */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "hsl(var(--foreground) / 0.55)",
              filter: "blur(8px)",
              transform: "scale(1.15)",
            }}
          />
          <div
            className="relative flex flex-col items-center gap-3.5 rounded-2xl border-2 border-primary-foreground/40 py-4 px-3 backdrop-blur-md"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--accent) / 0.95) 0%, hsl(var(--primary) / 0.95) 100%)",
              boxShadow:
                "0 0 0 1px hsl(var(--primary) / 0.5), -6px 0 24px -2px hsl(var(--foreground) / 0.45), inset 0 0 12px hsl(var(--primary-foreground) / 0.12)",
            }}
          >
            <VerticalSparkleDots level={relevanceLevel} />
            <Wand2 className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
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
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-body text-xs text-muted-foreground">{profile.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
