import { motion } from "framer-motion";
import { HeartPulse, MapPin, Shield, Wand2 } from "lucide-react";
import sparkleAsset from "@/assets/sparkle-1.png.asset.json";

interface Props {
  src: string;
  liked: boolean;
  onVibe: () => void;
  relevanceLevel?: 1 | 2 | 3;
  profile: {
    name: string;
    age: number;
    verified: boolean;
    profession: string;
    specialization: string;
    location: string;
  };
}

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
          {relevanceLevel !== undefined && (
            <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-start gap-2.5">
              <div className="relative h-7 w-7 rounded-full flex items-center justify-center bg-primary/10">
                <Wand2 className="h-3.5 w-3.5 text-primary" />
                <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "2.5s" }} />
              </div>
              <motion.div
                initial={false}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: relevanceLevel === 3 ? 0.9 : relevanceLevel === 2 ? 1.2 : 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <span
                  className="absolute inset-0 rounded-full blur-[8px] opacity-70"
                  style={{
                    backgroundColor: "hsl(var(--primary))",
                    transform: `scale(${relevanceLevel === 3 ? 1.6 : relevanceLevel === 2 ? 1.3 : 1})`,
                  }}
                />
                <Sparkles
                  className="relative transition-all duration-300"
                  style={{
                    color: "hsl(var(--primary))",
                    fill: "hsl(var(--primary) / 0.85)",
                  }}
                  size={relevanceLevel === 3 ? 22 : relevanceLevel === 2 ? 18 : 14}
                  strokeWidth={2}
                />
              </motion.div>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
