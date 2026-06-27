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

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-4 mt-2 mb-5"
      >
        <div
          className={`relative rounded-[28px] overflow-hidden p-6 bg-gradient-to-br ${gradient}`}
          style={{ boxShadow: "var(--shadow-warm)" }}
        >
          {/* Soft decorative blurs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-primary-foreground/8 blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-foreground/8 to-transparent" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary-foreground/12 backdrop-blur-sm border border-primary-foreground/10 flex items-center justify-center text-primary-foreground shadow-sm mb-4">
              {heroIconMap[topic.icon]}
            </div>
            <h1 className="font-display text-[22px] font-bold text-primary-foreground leading-tight">
              {topic.title}
            </h1>
            <p className="text-[12px] text-primary-foreground/80 mt-2 leading-relaxed font-body max-w-[85%]">
              {topic.subtitle}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/12 text-primary-foreground text-[10px] font-medium uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              {topic.tips.length} tips
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tips list */}
      <motion.main
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="flex-1 px-4 space-y-4"
      >
        {topic.tips.map((tip, i) => (
          <motion.div
            key={i}
            variants={stagger.item}
            className="rounded-[24px] border border-border/30 bg-card p-5 relative overflow-hidden"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            {/* Top accent gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-accent/40 to-transparent" />

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-display text-[13px] font-bold shadow-sm">
                {i + 1}
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
