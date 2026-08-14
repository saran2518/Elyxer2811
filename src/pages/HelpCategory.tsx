import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { faqCategories } from "@/lib/faqData";

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  },
};

const HelpCategory = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const category = faqCategories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Category not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-8 relative overflow-hidden">
      {/* Decorative background glows */}
      <div
        className="pointer-events-none absolute -top-[10%] -left-[20%] h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "hsl(var(--primary) / 0.25)" }}
      />
      <div
        className="pointer-events-none absolute bottom-[20%] -right-[10%] h-48 w-48 rounded-full opacity-20 blur-3xl"
        style={{ background: "hsl(var(--primary-glow) / 0.25)" }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2">
        <div
          className="flex items-center justify-between rounded-full border border-border/30 bg-card/80 backdrop-blur-xl px-4 py-2.5"
          style={{ boxShadow: "var(--shadow-glass)" }}
        >
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/help-faq")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/10">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Support Center
            </span>
          </div>
          <div className="w-8" />
        </div>
      </header>

      <main className="flex-1 px-5 mt-4 z-10">
        <motion.div variants={stagger.container} initial="initial" animate="animate" className="flex flex-col gap-6">
          {/* Hero */}
          <motion.div variants={stagger.item} className="flex flex-col items-center gap-3 pt-2 pb-1 text-center">
            <div
              className="h-16 w-16 rounded-2xl bg-card flex items-center justify-center border border-border/40"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-warm)" }}
              >
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="font-display text-[24px] font-semibold text-foreground tracking-tight leading-tight">
              {category.title}
            </h1>
            <p className="text-[13px] text-muted-foreground font-medium max-w-[280px]">
              {category.subtitle}
            </p>
          </motion.div>

          {/* Questions list */}
          <motion.div variants={stagger.item}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60 px-1 mb-3">
              Questions
            </p>
            <div
              className="rounded-2xl border border-border/20 bg-card/90 backdrop-blur-sm overflow-hidden"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {category.questions.map((q, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.99, backgroundColor: "hsl(var(--accent) / 0.08)" }}
                  onClick={() => navigate(`/help-faq/${slug}/${i}`)}
                  className={`w-full flex items-center justify-between py-4 px-5 hover:bg-accent/5 transition-colors group ${
                    i < category.questions.length - 1 ? "border-b border-border/15" : ""
                  }`}
                >
                  <span className="text-[14px] text-foreground text-left pr-4 leading-snug">{q.question}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/30 group-hover:text-primary/50 group-hover:translate-x-0.5 transition-all" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Contact support */}
          <motion.div variants={stagger.item} className="flex flex-col gap-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60 px-1">
              Reach the team
            </p>
            <button
              onClick={() => navigate("/contact-support")}
              className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left hover:shadow-lg transition-all group overflow-hidden relative"
              style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-elegant)" }}
            >
              <div className="relative h-11 w-11 rounded-full border-2 border-primary-foreground/20 bg-accent/80 flex items-center justify-center shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent)]" />
                <Mail className="h-5 w-5 text-primary-foreground relative z-10" />
                <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-accent" />
              </div>
              <div className="flex flex-col items-start gap-0.5 flex-1 relative z-10">
                <span className="text-[14px] font-semibold text-primary-foreground">Write to us</span>
              </div>
              <ChevronRight className="h-4 w-4 text-primary-foreground/60 group-hover:text-primary-foreground transition-colors relative z-10" />
            </button>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
};

export default HelpCategory;
