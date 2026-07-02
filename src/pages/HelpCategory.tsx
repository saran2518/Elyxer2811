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
    <div className="min-h-screen bg-background flex flex-col pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 px-2 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary font-medium gap-1 px-2 hover:bg-primary/5"
            onClick={() => navigate("/help-faq")}
          >
            <ArrowLeft className="h-4 w-4" />
            Help
          </Button>
          <span className="font-display text-base font-semibold text-foreground tracking-tight">
            {category.title}
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 mt-2">
        <motion.div variants={stagger.container} initial="initial" animate="animate" className="flex flex-col gap-5">
          {/* Subtitle */}
          <motion.p variants={stagger.item} className="text-[13px] text-muted-foreground px-1">
            {category.subtitle}
          </motion.p>

          {/* Questions list */}
          <motion.div
            variants={stagger.item}
            className="rounded-2xl border border-border/20 bg-card overflow-hidden"
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
          </motion.div>

          {/* Quick contact link */}
          <motion.div variants={stagger.item}>
            <button
              onClick={() => navigate("/contact-support")}
              className="w-full flex items-center gap-3 rounded-2xl border border-border/20 bg-card px-5 py-3.5 hover:border-primary/20 transition-all group"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <MessageCircle className="h-4 w-4 text-primary/60" />
              <span className="text-[12px] text-muted-foreground group-hover:text-foreground transition-colors">
                Can't find what you need? <span className="text-primary font-medium">Contact us</span>
              </span>
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default HelpCategory;
