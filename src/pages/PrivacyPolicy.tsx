import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Mail, FileText, ChevronRight } from "lucide-react";

const fullPolicy = [
  {
    title: "Information we collect",
    body: "We collect the details you provide when you create your profile — name, age, photos, preferences and the answers you share — along with basic device and usage information needed to keep the app running securely.",
  },
  {
    title: "How we use your information",
    body: "Your information is used to build your profile, curate relevant matches, keep the community safe, and provide support. We never use it to build advertising audiences.",
  },
  {
    title: "Who can see your profile",
    body: "Your profile is visible to registered Elyxer members within your discovery preferences. Members you block, and members who block you, cannot see your profile.",
  },
  {
    title: "Data retention & deletion",
    body: "You can pause your account at any time to hide your profile, or delete it permanently. When you delete your account, your profile and messages are removed from the app and deleted from our systems within 30 days, except where we must retain records by law.",
  },
  {
    title: "Your choices",
    body: "You control your photos, visibility, notifications and private browsing from Settings. You may request a copy of your data or its deletion by writing to support@elyxer.co.",
  },
];

const overview = [
  "We do not sell your personal data.",
  "We do not use advertising or third-party tracking services.",
  "We use your activity only to curate more relevant profiles — never for advertising.",
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <header className="shrink-0 flex items-center gap-3 px-4 h-16 border-b border-border/40">
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
        className="flex-1 overflow-y-auto px-4 py-5 pb-10 space-y-6"
      >
        {/* Overview card */}
        <section
          className="rounded-[20px] border border-primary/25 p-5"
          style={{ background: "hsl(45 80% 92% / 0.6)" }}
        >
          <h2 className="font-display text-[19px] text-accent mb-3">Overview</h2>
          <ul className="space-y-3">
            {overview.map((item) => (
              <li key={item} className="flex gap-3">
                <Check className="h-4 w-4 text-primary shrink-0 mt-1" />
                <span className="text-[14px] text-foreground/85 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Essential services */}
        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-2">
            Essential Services
          </h3>
          <p className="text-[14px] text-foreground/80 leading-relaxed">
            Elyxer uses essential third-party services to support core features
            such as sign-in, messaging, verification, and payments. These are
            never used for advertising or tracking.
          </p>
          <p className="text-[13px] text-muted-foreground mt-2">
            See our full Privacy Policy for details.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-2">
            Contact
          </h3>
          <a
            href="mailto:support@elyxer.co"
            className="flex items-center gap-3 rounded-[18px] border border-border/50 bg-card/60 p-3.5 hover:bg-card transition-colors"
          >
            <span className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="h-4.5 w-4.5 text-primary" />
            </span>
            <span className="text-[15px] text-foreground">support@elyxer.co</span>
          </a>

          <button
            onClick={() => setShowFull((v) => !v)}
            className="mt-3 w-full flex items-center gap-3 rounded-[18px] border border-border/50 bg-card p-3.5 hover:bg-muted/40 transition-colors text-left"
          >
            <span className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
              <FileText className="h-4.5 w-4.5 text-primary" />
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-medium text-foreground">
                Full Privacy Policy
              </span>
              <span className="block text-[13px] text-muted-foreground">
                Read the complete policy
              </span>
            </span>
            <ChevronRight
              className={`h-4.5 w-4.5 text-muted-foreground transition-transform ${showFull ? "rotate-90" : ""}`}
            />
          </button>

          {showFull && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 space-y-3"
            >
              {fullPolicy.map(({ title, body }) => (
                <div
                  key={title}
                  className="rounded-[18px] border border-border/40 bg-card/60 p-4"
                >
                  <h4 className="font-display text-[15px] text-foreground mb-1.5">
                    {title}
                  </h4>
                  <p className="text-[13px] text-foreground/75 leading-relaxed">
                    {body}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </section>

        <p className="text-[12px] text-center text-muted-foreground/70 pt-2">
          Version 1.0 · Last updated{" "}
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </motion.main>
    </div>
  );
};

export default PrivacyPolicy;
