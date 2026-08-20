import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    setStep(0);
    setDir(1);
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
  const isEnd = step === total;
  const tip = topic.tips[step];

  const go = (delta: number) => {
    setDir(delta);
    setStep((s) => Math.min(total, Math.max(0, s + delta)));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-6">
      {/* Header */}
      <header className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="text-[9.5px] font-body tracking-[0.2em] uppercase text-muted-foreground/80">
              Dating tips
            </p>
            <p className="font-display text-[16px] text-foreground truncate leading-tight">
              {topic.title}
            </p>
          </div>
          <span className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon className="h-[17px] w-[17px]" strokeWidth={1.5} />
          </span>
        </div>

        {/* Segmented progress */}
        <div className="mt-3 flex items-center gap-1.5">
          {topic.tips.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to tip ${i + 1}`}
              onClick={() => {
                setDir(i > step ? 1 : -1);
                setStep(i);
              }}
              className="h-[3px] flex-1 rounded-full bg-border/60 overflow-hidden"
            >
              <motion.span
                className="block h-full rounded-full bg-gradient-to-r from-accent to-primary"
                initial={false}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </button>
          ))}
        </div>
      </header>

      {/* Card deck */}
      <main className="flex-1 px-5 pt-2 flex flex-col">
        <div className="relative flex-1">
          <AnimatePresence mode="wait" custom={dir}>
            {!isEnd ? (
              <motion.article
                key={step}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60 && step > 0) go(-1);
                }}
                className="rounded-[24px] border border-border/40 bg-card p-6 pt-7"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[34px] leading-none text-primary/70">
                    {String(step + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-body tracking-[0.18em] uppercase text-muted-foreground/70">
                    of {String(total).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-4 h-px w-14 bg-gradient-to-r from-primary/60 to-transparent" />
                <h1 className="font-display text-[23px] leading-[1.2] text-foreground mt-4">
                  {tip.title}
                </h1>
                <p className="text-[14px] text-muted-foreground mt-3 leading-relaxed font-body">
                  {tip.description}
                </p>
              </motion.article>
            ) : (
              <motion.div
                key="end"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[24px] border border-border/40 bg-card p-6"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <span className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <h2 className="font-display text-[22px] leading-tight text-foreground mt-4">
                  You've finished {topic.title}
                </h2>
                <p className="text-[13.5px] text-muted-foreground mt-2 leading-relaxed font-body">
                  {total} essentials read. Carry one of them into your next conversation.
                </p>

                <button
                  type="button"
                  onClick={() => navigate(`/dating-tips/${next.slug}`)}
                  className="w-full mt-6 rounded-[18px] border border-border/40 bg-background p-3.5 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        {!isEnd && (
          <div className="pt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={step === 0}
              className="h-12 w-12 rounded-full border border-border/50 bg-card text-foreground flex items-center justify-center disabled:opacity-40 active:scale-95 transition"
              aria-label="Previous tip"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-display text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              {step === total - 1 ? "Finish" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        {!isEnd && (
          <p className="text-center text-[11px] font-body text-muted-foreground/70 pt-2.5">
            Swipe to move between tips
          </p>
        )}
      </main>
    </div>
  );
};

export default DatingTipDetail;
