import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, MessageSquare, Heart, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { datingTopics } from "@/lib/datingTipsData";

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="h-5 w-5" />,
  Eye: <Eye className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
  Star: <Star className="h-5 w-5" />,
};

const heroIconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="h-7 w-7" strokeWidth={1.5} />,
  Eye: <Eye className="h-7 w-7" strokeWidth={1.5} />,
  MessageSquare: <MessageSquare className="h-7 w-7" strokeWidth={1.5} />,
  Heart: <Heart className="h-7 w-7" strokeWidth={1.5} />,
  Sparkles: <Sparkles className="h-7 w-7" strokeWidth={1.5} />,
  Star: <Star className="h-7 w-7" strokeWidth={1.5} />,
};

const gradientMap: Record<string, string> = {
  Shield: "from-[hsl(12,76%,61%)] to-[hsl(340,45%,55%)]",
  Eye: "from-[hsl(340,45%,55%)] to-[hsl(280,40%,55%)]",
  MessageSquare: "from-[hsl(200,60%,55%)] to-[hsl(170,50%,45%)]",
  Heart: "from-[hsl(12,76%,61%)] to-[hsl(35,80%,55%)]",
  Sparkles: "from-[hsl(280,40%,55%)] to-[hsl(12,76%,61%)]",
  Star: "from-[hsl(170,50%,45%)] to-[hsl(200,60%,55%)]",
};

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 18, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
  },
};

const DatingTipDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const topic = datingTopics.find((t) => t.slug === slug);

  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Topic not found.</p>
      </div>
    );
  }

  const gradient = gradientMap[topic.icon] || gradientMap.Shield;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-8">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 rounded-full border border-border/30 bg-card/80 backdrop-blur-xl px-4 py-2.5">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="font-display text-base font-semibold text-foreground tracking-tight truncate">
            {topic.title}
          </span>
        </div>
      </header>

      {/* Topic title card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-4 mt-3 mb-4"
      >
        <div
          className="relative rounded-2xl overflow-hidden p-4 bg-card border border-border/40 flex items-center gap-4"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Soft gradient wash */}
          <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${gradient}`} />

          {/* Icon */}
          <div className="relative z-10 shrink-0 h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            {heroIconMap[topic.icon]}
          </div>

          {/* Text */}
          <div className="relative z-10 flex flex-col min-w-0 flex-1">
            <h1 className="font-display text-lg font-semibold text-foreground leading-tight truncate">
              {topic.title}
            </h1>
            <p className="text-[11px] font-medium text-muted-foreground tracking-wide mt-0.5 uppercase truncate">
              {topic.subtitle}
            </p>
          </div>

          {/* Decorative dot */}
          <div className="relative z-10 shrink-0 h-1.5 w-1.5 rounded-full bg-primary/40" />
        </div>
      </motion.div>

      {/* Tips list */}
      <motion.main
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="flex-1 px-4 space-y-3"
      >
        {topic.tips.map((tip, i) => (
          <motion.div
            key={i}
            variants={stagger.item}
            className="rounded-[20px] border border-border/30 bg-card p-5 relative overflow-hidden"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/40 via-accent/40 to-transparent" />

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 text-primary/70 flex items-center justify-center mt-0.5">
                {iconMap[topic.icon]}
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="text-[15px] font-display font-semibold text-foreground leading-tight">
                  {tip.title}
                </h3>
                <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed font-body">
                  {tip.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.main>

      {/* Bottom quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center text-[11px] text-muted-foreground/70 mt-8 px-8 leading-relaxed italic"
      >
        "Small shifts in how you show up create the biggest connections."
      </motion.p>
    </div>
  );
};

export default DatingTipDetail;
