import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, MessageSquare, Heart, Sparkles, Star, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { datingTopics } from "@/lib/datingTipsData";
import heroAsset from "@/assets/dating-tips-hero.png.asset.json";

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  Eye: <Eye className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  MessageSquare: <MessageSquare className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  Heart: <Heart className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  Sparkles: <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  Star: <Star className="h-[18px] w-[18px]" strokeWidth={1.75} />,
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
  container: { animate: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
  },
};

const DatingTips = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Hero with image */}
      <div className="relative">
        <div className="relative h-[340px] w-full overflow-hidden">
          <img
            src={heroAsset.url}
            alt="Couple enjoying coffee at a café"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* gradient fade to bg */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />

          {/* floating back button */}
          <div className="absolute top-3 left-3 right-3 z-10">
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
          className="relative -mt-20 mx-4 rounded-[24px] bg-card border border-border/40 p-5"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-primary/80">
              Your dating guide
            </span>
          </div>
          <h1 className="font-display text-[26px] leading-[1.1] font-bold text-foreground tracking-tight">
            Date smarter,<br />
            <span className="italic font-light text-primary">connect deeper.</span>
          </h1>
          <p className="text-[13px] text-muted-foreground mt-2.5 leading-relaxed">
            Six honest chapters on showing up, staying safe, and building something that lasts.
          </p>

          {/* meta strip */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/40">
            <div>
              <p className="text-[18px] font-display font-semibold text-foreground leading-none">
                {datingTopics.length}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Chapters
              </p>
            </div>
            <div className="h-8 w-px bg-border/60" />
            <div>
              <p className="text-[18px] font-display font-semibold text-foreground leading-none">
                {datingTopics.reduce((a, t) => a + t.tips.length, 0)}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Tips
              </p>
            </div>
            <div className="h-8 w-px bg-border/60" />
            <div>
              <p className="text-[18px] font-display font-semibold text-foreground leading-none">5m</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Each read
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section label */}
      <div className="px-4 mt-7 mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-[15px] font-semibold text-foreground tracking-tight">
          Browse chapters
        </h2>
        <span className="text-[11px] text-muted-foreground">Tap to read</span>
      </div>

      {/* Topic list — editorial style */}
      <motion.main
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="px-4 space-y-2.5"
      >
        {datingTopics.map((topic, i) => {
          const accent = accents[i % accents.length];
          return (
            <motion.button
              key={topic.slug}
              variants={stagger.item}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/dating-tips/${topic.slug}`)}
              className="w-full rounded-[20px] bg-card border border-border/40 p-4 text-left group hover:border-primary/30 transition-all"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-3.5">
                {/* number + accent bar */}
                <div className="flex flex-col items-center gap-1.5 shrink-0 w-8">
                  <span
                    className="text-[10px] font-display font-semibold tabular-nums"
                    style={{ color: accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${accent}15`, color: accent }}
                  >
                    {iconMap[topic.icon]}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-display font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {topic.title}
                  </p>
                  <p className="text-[11.5px] text-muted-foreground mt-1 leading-snug">
                    {topic.subtitle} · {topic.tips.length} tips
                  </p>
                </div>

                <div className="h-8 w-8 rounded-full bg-muted/40 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.main>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center text-[11px] text-muted-foreground/70 mt-8 px-8 leading-relaxed italic"
      >
        "The best conversations begin with curiosity, not certainty."
      </motion.p>
    </div>
  );
};

export default DatingTips;
