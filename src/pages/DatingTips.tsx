import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, MessageSquare, Heart, Sparkles, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { datingTopics } from "@/lib/datingTipsData";
import heroAsset from "@/assets/dating-tips-hero.png.asset.json";

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="h-4 w-4" strokeWidth={1.75} />,
  Eye: <Eye className="h-4 w-4" strokeWidth={1.75} />,
  MessageSquare: <MessageSquare className="h-4 w-4" strokeWidth={1.75} />,
  Heart: <Heart className="h-4 w-4" strokeWidth={1.75} />,
  Sparkles: <Sparkles className="h-4 w-4" strokeWidth={1.75} />,
  Star: <Star className="h-4 w-4" strokeWidth={1.75} />,
};

const accents = [
  "hsl(12,76%,61%)",
  "hsl(340,45%,55%)",
  "hsl(200,60%,55%)",
  "hsl(35,80%,55%)",
  "hsl(280,40%,55%)",
  "hsl(170,50%,45%)",
];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } },
  item: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  },
};

const DatingTips = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Hero with image */}
      <div className="relative">
        <div className="relative h-[220px] w-full overflow-hidden">
          <img
            src={heroAsset.url}
            alt="Couple enjoying coffee at a café"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* gradient fade to bg */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />

          {/* floating back button */}
          <div className="absolute top-3 left-3 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10 rounded-full bg-background/70 backdrop-blur-xl border border-white/20 hover:bg-background/90"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Title card lifted over hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative -mt-12 mx-4 rounded-[24px] bg-card border border-border/40 p-4"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-primary/80">
              Your dating guide
            </span>
          </div>
          <h1 className="font-display text-[24px] leading-[1.1] font-bold text-foreground tracking-tight">
            Date smarter,<br />
            <span className="italic font-light text-primary">connect deeper.</span>
          </h1>
        </motion.div>
      </div>

      {/* Topic cards grid */}
      <motion.main
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="px-4 mt-5 grid grid-cols-2 gap-2"
      >
        {datingTopics.map((topic, i) => {
          const accent = accents[i % accents.length];
          return (
            <motion.button
              key={topic.slug}
              variants={stagger.item}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/dating-tips/${topic.slug}`)}
              className="w-full rounded-[16px] bg-card border border-border/40 p-3 text-left group hover:border-primary/30 transition-all"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: `${accent}15`, color: accent }}
              >
                {iconMap[topic.icon]}
              </div>

              <p className="text-[13px] font-display font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                {topic.title}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-1">
                {topic.subtitle}
              </p>

              <div className="mt-2 flex items-center gap-1 text-[10px] font-medium" style={{ color: accent }}>
                <span>Read</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </motion.main>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center text-[11px] text-muted-foreground/70 mt-4 px-8 leading-relaxed italic"
      >
        "The best conversations begin with curiosity, not certainty."
      </motion.p>
    </div>
  );
};

export default DatingTips;

