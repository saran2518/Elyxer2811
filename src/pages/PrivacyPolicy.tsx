import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Mail,
  FileText,
  ChevronRight,
  ShieldCheck,
  KeyRound,
  MessageSquare,
  BadgeCheck,
  CreditCard,
} from "lucide-react";

const overview = [
  {
    title: "We never sell your data",
    body: "Your personal information is never sold, rented, or traded.",
  },
  {
    title: "No ads, no trackers",
    body: "Elyxer runs no advertising and no third-party tracking services.",
  },
  {
    title: "Activity stays in Elyxer",
    body: "We use your activity only to curate more relevant profiles for you.",
  },
];

const services = [
  { icon: KeyRound, label: "Sign-in" },
  { icon: MessageSquare, label: "Messaging" },
  { icon: BadgeCheck, label: "Verification" },
  { icon: CreditCard, label: "Payments" },
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 shrink-0 flex items-center gap-3 px-4 h-16 border-b border-border/40 bg-background/85 backdrop-blur">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-4.5 w-4.5 text-foreground" />
        </button>
        <h1 className="font-display text-[22px] text-foreground tracking-tight">
          Privacy Policy
        </h1>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex-1 overflow-y-auto px-4 py-6 pb-12 space-y-7"
      >
        {/* Hero plate */}
        <section
          className="relative rounded-[24px] border border-primary/20 overflow-hidden px-5 py-6 text-center"
          style={{ background: "var(--gradient-ivory)" }}
        >
          <div
            className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: "hsl(41 70% 64% / 0.35)" }}
          />
          <span
            className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-warm)" }}
          >
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </span>
          <h2 className="relative font-display text-[24px] leading-tight text-foreground">
            Privacy, by design
          </h2>
          <p className="relative mt-2 text-[13.5px] leading-relaxed text-muted-foreground max-w-[30ch] mx-auto">
            A short, plain-language summary of how Elyxer handles your data.
          </p>
        </section>

        {/* Overview */}
        <section className="space-y-3">
          <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary">
            The essentials
          </h3>
          <div className="space-y-2.5">
            {overview.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="flex gap-3 rounded-[20px] border border-border/40 bg-card/70 p-4"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <span
                  className="mt-0.5 h-7 w-7 shrink-0 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(45 80% 92% / 0.9)" }}
                >
                  <Check className="h-3.5 w-3.5 text-accent" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[15px] text-foreground leading-snug">
                    {item.title}
                  </span>
                  <span className="block text-[13px] leading-relaxed text-muted-foreground mt-0.5">
                    {item.body}
                  </span>
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Essential services */}
        <section className="space-y-3">
          <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary">
            Essential services
          </h3>
          <p className="text-[13.5px] text-foreground/80 leading-relaxed">
            Elyxer relies on a few trusted providers to power core features. They
            are never used for advertising or tracking.
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {services.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-[16px] border border-border/40 bg-card/60 px-3.5 py-3"
              >
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <span className="text-[13.5px] text-foreground/85">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact & full policy */}
        <section className="space-y-3">
          <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary">
            Read more · Reach us
          </h3>

          <button
            onClick={() => navigate("/privacy/full")}
            className="w-full flex items-center gap-3 rounded-[20px] border border-primary/25 p-4 text-left transition-transform active:scale-[0.99]"
            style={{ background: "hsl(45 80% 92% / 0.55)" }}
          >
            <span
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gradient-gold)" }}
            >
              <FileText className="h-4.5 w-4.5 text-primary-foreground" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-display text-[15.5px] text-foreground">
                Full Privacy Policy
              </span>
              <span className="block text-[12.5px] text-muted-foreground">
                All 20 sections · DPDP Act, 2023
              </span>
            </span>
            <ChevronRight className="h-4.5 w-4.5 text-primary shrink-0" />
          </button>

          <a
            href="mailto:support@elyxer.co"
            className="w-full flex items-center gap-3 rounded-[20px] border border-border/50 bg-card/70 p-4 hover:bg-card transition-colors"
          >
            <span className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="h-4.5 w-4.5 text-primary" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
                Privacy questions
              </span>
              <span className="block text-[14.5px] text-foreground truncate">
                support@elyxer.co
              </span>
            </span>
            <ChevronRight className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
          </a>
        </section>

        <p className="text-[11.5px] text-center text-muted-foreground/70 pt-1">
          Version 1.0 · Last updated{" "}
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </motion.main>
    </div>
  );
};

export default PrivacyPolicy;
