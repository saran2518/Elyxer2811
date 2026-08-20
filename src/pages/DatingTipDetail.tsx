import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Eye,
  MessageSquare,
  Heart,
  Sparkles,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { datingTopics } from "@/lib/datingTipsData";

const icons: Record<string, typeof Shield> = {
  Shield,
  Eye,
  MessageSquare,
  Heart,
  Sparkles,
  Star,
};

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    },
  },
};

const DatingTipDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const index = datingTopics.findIndex((t) => t.slug === slug);
  const topic = datingTopics[index];
  const [read, setRead] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setRead([]);
    window.scrollTo({ top: 0 });
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Topic not found.</p>
      </div>
    );
  }

  const Icon = icons[topic.icon] ?? Shield;
  const next = datingTopics[(index + 1) % datingTopics.length];
  const NextIcon = icons[next.icon] ?? Shield;
  const total = topic.tips.length;
  const done = read.length;

  const toggle = (i: number) =>
    setRead((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <div className="min-h-screen bg-background flex flex-col pb-14">
      {/* Sticky header with reading progress */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2">
        <div className="rounded-full border border-border/30 bg-card/80 backdrop-blur-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="font-display text-[15px] text-foreground tracking-tight truncate flex-1">
              {topic.title}
            </span>
            <span className="shrink-0 text-[10px] font-body tracking-[0.14em] uppercase text-muted-foreground/80 pr-1">
              {done}/{total}
            </span>
          </div>
          <div className="h-[2px] bg-border/40">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-primary"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Editorial intro */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-6 pt-6 pb-5"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <span className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </span>
          <span className="text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground">
            {total} essentials
          </span>
        </div>
        <h1 className="font-display text-[28px] leading-[1.15] text-foreground">{topic.title}</h1>
        <p className="text-[13px] text-muted-foreground mt-2 font-body leading-relaxed">
          {topic.subtitle}
        </p>
        <div className="mt-5 h-px w-full bg-gradient-to-r from-primary/50 via-accent/30 to-transparent" />
      </motion.section>

      {/* Timeline of tips */}
      <motion.main
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="flex-1 px-6"
      >
        <ol className="relative">
          {topic.tips.map((tip, i) => {
            const isRead = read.includes(i);
            const isLast = i === total - 1;
            return (
              <motion.li key={i} variants={stagger.item} className="relative pl-11 pb-7">
                {/* Connector */}
                {!isLast && (
                  <span className="absolute left-[15px] top-9 bottom-0 w-px bg-border/60" />
                )}
                {/* Step marker */}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-label={isRead ? "Mark as unread" : "Mark as read"}
                  aria-pressed={isRead}
                  className={`absolute left-0 top-0 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRead
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground"
                  }`}
                >
                  {isRead ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <span className="font-display text-[13px]">{i + 1}</span>
                  )}
                </button>

                <div className={`transition-opacity duration-300 ${isRead ? "opacity-60" : ""}`}>
                  <h3 className="font-display text-[17px] leading-snug text-foreground pt-1">
                    {tip.title}
                  </h3>
                  <p className="text-[13.5px] text-muted-foreground mt-2 leading-relaxed font-body">
                    {tip.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>

        {/* Closing note */}
        <div
          className="rounded-[20px] border border-border/40 bg-card p-5 mt-2"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <p className="font-display text-[15px] text-foreground leading-snug">
            “Small shifts in how you show up create the biggest connections.”
          </p>
          <p className="text-[11px] text-muted-foreground mt-2 font-body">
            {done === total
              ? "You've covered every essential in this chapter."
              : `${total - done} left in this chapter — tap a number to mark it read.`}
          </p>
        </div>

        {/* Next topic */}
        <button
          type="button"
          onClick={() => navigate(`/dating-tips/${next.slug}`)}
          className="w-full mt-4 rounded-[20px] border border-border/40 bg-card p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <NextIcon className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[10px] font-body tracking-[0.18em] uppercase text-muted-foreground">
              Up next
            </span>
            <span className="block font-display text-[15px] text-foreground truncate">
              {next.title}
            </span>
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/dating-tips")}
          className="w-full mt-3 text-center text-[12px] font-body text-muted-foreground/80 py-2"
        >
          All topics
        </button>
      </motion.main>
    </div>
  );
};

export default DatingTipDetail;
