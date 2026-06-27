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
    initial: { opacity: 0, y: 18, scale: 0.97 },
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
      {/* Header */}
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

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-4 mt-2 mb-5"
      >
        <div
          className={`relative rounded-[20px] overflow-hidden p-5 bg-gradient-to-br ${gradient}`}
          style={{ boxShadow: "var(--shadow-warm)" }}
        >
          {/* Decorative blurs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/8 blur-xl" />
          <motion.div
            className="absolute top-4 right-6 w-20 h-20 rounded-full blur-2xl"
            style={{ background: "rgba(255,255,255,0.08)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 text-primary-foreground shadow-sm">
              {iconMap[topic.icon]}
            </div>
            <div>
              <h1 className="font-display text-[18px] font-bold text-primary-foreground leading-tight">
                {topic.title}
              </h1>
              <p className="text-[12px] text-primary-foreground/70 mt-1 leading-relaxed font-body">
                {topic.subtitle}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tips List */}
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
            className="rounded-[20px] border border-border/30 bg-card p-4 group"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-display font-semibold text-foreground leading-tight">
                {tip.title}
              </p>
              <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed font-body">
                {tip.description}
              </p>
            </div>

            {/* Subtle accent line */}
            {i < topic.tips.length - 1 && (
              <div className="mt-3.5 h-[1.5px] rounded-full bg-muted/30 overflow-hidden">
                <div
                  className={`h-full w-1/4 rounded-full bg-gradient-to-r ${gradient} opacity-30`}
                />
              </div>
            )}
          </motion.div>
        ))}
      </motion.main>

    </div>
  );
};

export default DatingTipDetail;
