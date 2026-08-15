import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Mail, FileText, ChevronRight } from "lucide-react";

const overview = [
  "We do not sell your personal data.",
  "We do not use advertising or third-party tracking services.",
  "We use your activity only to curate more relevant profiles — never for advertising.",
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
        <h1 className="font-display text-[24px] text-foreground tracking-tight">
          Privacy Policy
        </h1>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex-1 overflow-y-auto px-4 py-6 pb-12 space-y-7"
      >
        {/* Overview card */}
        <section
          className="relative rounded-[24px] border border-primary/25 p-5 overflow-hidden"
          style={{
            background: "hsl(45 80% 92% / 0.6)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div
            className="pointer-events-none absolute -top-20 -right-10 h-40 w-40 rounded-full blur-3xl"
            style={{ background: "hsl(41 70% 64% / 0.3)" }}
          />
          <h2 className="relative font-display text-[19px] text-accent mb-3.5">
            Overview
          </h2>
          <ul className="relative space-y-3">
            {overview.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.06 * i }}
                className="flex gap-3"
              >
                <span
                  className="mt-0.5 h-6 w-6 shrink-0 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(50 60% 99% / 0.9)" }}
                >
                  <Check className="h-3.5 w-3.5 text-primary" />
                </span>
                <span className="text-[14px] text-foreground/85 leading-relaxed">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Essential services */}
        <section
          className="rounded-[22px] border border-border/40 bg-card/70 p-5"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary mb-2.5">
            Essential Services
          </h3>
          <p className="text-[14px] text-foreground/80 leading-relaxed">
            Elyxer uses essential third-party services to support core features
            such as sign-in, messaging, verification, and payments. These are
            never used for advertising or tracking.
          </p>
          <div
            className="my-3.5 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, hsl(36 53% 51% / 0.35), transparent)",
            }}
          />
          <p className="text-[13px] text-muted-foreground">
            See our full Privacy Policy for details.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-2.5">
          <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary mb-1">
            Contact
          </h3>
          <a
            href="mailto:support@elyxer.co"
            className="flex items-center gap-3 rounded-[20px] border border-border/50 bg-card/70 p-4 hover:bg-card transition-colors"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <span className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="h-4.5 w-4.5 text-primary" />
            </span>
            <span className="flex-1 text-[15px] text-foreground truncate">
              support@elyxer.co
            </span>
            <ChevronRight className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
          </a>

          <button
            onClick={() => navigate("/privacy/full")}
            className="w-full flex items-center gap-3 rounded-[20px] border border-primary/25 p-4 text-left transition-transform active:scale-[0.99]"
            style={{
              background: "hsl(45 80% 92% / 0.55)",
              boxShadow: "var(--shadow-card)",
            }}
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
              <span className="block text-[13px] text-muted-foreground">
                Read the complete policy
              </span>
            </span>
            <ChevronRight className="h-4.5 w-4.5 text-primary shrink-0" />
          </button>
        </section>

        <p className="text-[12px] text-center text-muted-foreground/70 pt-1">
          Version 1.0 · Last updated{" "}
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </motion.main>
    </div>
  );
};

export default PrivacyPolicy;
