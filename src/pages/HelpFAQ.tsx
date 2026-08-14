import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Compass,
  Users,
  Shield,
  Sparkles,
  CreditCard,
  ChevronRight,
  HelpCircle,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { faqCategories } from "@/lib/faqData";

const categories = [
  { icon: <User className="h-5 w-5" />, label: "Profile &\nAccount", slug: "profile-account" },
  { icon: <Compass className="h-5 w-5" />, label: "Discovery\nPreferences", slug: "discovery-preferences" },
  { icon: <Users className="h-5 w-5" />, label: "Invites &\nVibes", slug: "invites-connections" },
  { icon: <Shield className="h-5 w-5" />, label: "Safety &\nPrivacy", slug: "safety-privacy" },
  { icon: <CreditCard className="h-5 w-5" />, label: "Payments", slug: "payments" },
  { icon: <Sparkles className="h-5 w-5" />, label: "Profile\nStudio", slug: "profile-studio" },
];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  },
};

const HelpFAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
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
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/profile")}>
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
          <motion.div variants={stagger.item} className="flex flex-col items-center gap-3 pt-2 pb-1">
            <div
              className="h-16 w-16 rounded-2xl bg-card flex items-center justify-center border border-border/40"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-warm)" }}
              >
                <HelpCircle className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="font-display text-[26px] font-semibold text-foreground tracking-tight">
              How can we help?
            </h1>
            <p className="text-[13px] text-muted-foreground font-medium">
              Browse answers, or write to us.
            </p>
          </motion.div>

          {/* Category Grid */}
          <motion.div variants={stagger.item}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60 px-1 mb-3">
              Browse Topics
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {categories.map((cat, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(`/help-faq/${cat.slug}`)}
                  className="rounded-2xl border border-border/20 bg-card/80 backdrop-blur-sm px-2 py-4 flex flex-col items-center gap-2.5 hover:border-primary/25 hover:shadow-md transition-all duration-300 group"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-primary group-hover:from-primary/20 group-hover:to-accent/10 transition-all duration-300">
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-foreground leading-tight text-center whitespace-pre-line">
                    {cat.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Contact Support */}
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

      <div className="h-6" />
    </div>
  );
};

export default HelpFAQ;

