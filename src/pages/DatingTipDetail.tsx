import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Shield,
  Eye,
  MessageSquare,
  Heart,
  Sparkles,
  Star,
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

const DatingTipDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const index = datingTopics.findIndex((t) => t.slug === slug);
  const topic = datingTopics[index];
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    setOpen(0);
    window.scrollTo({ top: 0 });
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

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Editorial hero band */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/12 via-accent/8 to-transparent" />
        <div className="relative px-4 pt-4 pb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full bg-card/70 backdrop-blur-xl border border-border/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="mt-6 flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-card/80 border border-border/40 text-primary flex items-center justify-center">
              <Icon className="h-4 w-4" strokeWidth={1.6} />
            </span>
            <span className="text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground">
              {total} essentials
            </span>
          </div>

          <h1 className="font-display text-[30px] leading-[1.12] text-foreground mt-3">
            {topic.title}
          </h1>
          <p className="text-[13.5px] text-muted-foreground mt-2 font-body leading-relaxed max-w-[86%]">
            {topic.subtitle}
          </p>
        </div>
      </section>

      {/* Accordion list */}
      <main className="px-4 -mt-3 space-y-2.5">
        {topic.tips.map((tip, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-[20px] border bg-card overflow-hidden transition-colors ${
                isOpen ? "border-primary/35" : "border-border/40"
              }`}
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
              >
                <span
                  className={`font-display text-[15px] h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex-1 min-w-0 font-display text-[16px] leading-snug text-foreground">
                  {tip.title}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-muted-foreground shrink-0"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pl-[60px]">
                      <div className="h-px w-full bg-border/50 mb-3" />
                      <p className="text-[13.5px] text-muted-foreground leading-relaxed font-body">
                        {tip.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Up next */}
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
          className="w-full text-center text-[12px] font-body text-muted-foreground/80 py-2"
        >
          All topics
        </button>
      </main>
    </div>
  );
};

export default DatingTipDetail;
