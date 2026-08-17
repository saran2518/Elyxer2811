import { motion } from "framer-motion";
import { HeartPulse, MapPin, Shield, Wand2 } from "lucide-react";

interface Props {
  src: string;
  liked: boolean;
  onVibe: () => void;
  relevance?: number;
  matchedTerms?: string[];
  profile: {
    name: string;
    age: number;
    verified: boolean;
    profession: string;
    specialization: string;
    location: string;
  };
}

export default function ProfilePhotoCard({ src, liked, onVibe, profile, relevance, matchedTerms }: Props) {
  const label = relevance === undefined ? null : relevance >= 80 ? "Strong match" : relevance >= 50 ? "Good match" : "Loose match";

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

      {relevance !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 22 }}
          className="absolute top-4 left-4 flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full bg-card/85 backdrop-blur-md border border-primary/25"
          style={{ boxShadow: "0 6px 20px -8px hsl(var(--foreground) / 0.35)" }}
        >
          <Wand2 className="h-3.5 w-3.5 text-primary" />
          <span className="font-display text-[13px] font-bold text-foreground">{relevance}%</span>
          <span className="font-body text-[11px] text-muted-foreground">{label}</span>
        </motion.div>
      )}

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
        </div>
      </div>
    </motion.div>
  );
}
