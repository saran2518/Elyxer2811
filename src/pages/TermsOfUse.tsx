import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Scale } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using Elyxer, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use the service.",
  },
  {
    title: "2. Subscriptions & Billing",
    body: "Elyxer is free to join and use. Elyxer Plus and Elyxer Infinity are optional subscriptions that unlock additional features. Payments are charged to your Google Play account and renew automatically until you cancel the subscription in your Google Play settings. Prices are displayed in your local currency and may be subject to change with notice.",
  },
  {
    title: "3. Account & Conduct",
    body: "You are responsible for maintaining the confidentiality of your account and for all activity that occurs under your account. You agree to use Elyxer in a respectful, lawful manner and in accordance with our Community Guidelines. Harassment, impersonation, fraud, or distribution of harmful content may result in suspension or termination.",
  },
  {
    title: "4. Cancellations & Refunds",
    body: "You may cancel your subscription at any time through your Google Play subscription settings. Cancellation will take effect at the end of the current billing period. Refunds are handled in accordance with Google Play policies and applicable local law.",
  },
  {
    title: "5. Intellectual Property",
    body: "All content, design, branding, and software provided through Elyxer is the property of Elyxer or its licensors. You may not copy, modify, distribute, or create derivative works without prior written permission.",
  },
  {
    title: "6. Limitation of Liability",
    body: "Elyxer is provided on an 'as is' and 'as available' basis. To the fullest extent permitted by law, Elyxer shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.",
  },
  {
    title: "7. Changes to Terms",
    body: "We may update these Terms of Use from time to time. Continued use of Elyxer after changes constitutes acceptance of the revised terms. Material changes will be communicated through the app or via email where appropriate.",
  },
  {
    title: "8. Contact Us",
    body: "If you have any questions about these Terms of Use, please contact us through the Help & Support section in the app or at our support email.",
  },
];

const TermsOfUse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-background relative overflow-hidden">
      {/* Decorative aura */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "hsl(41 70% 64% / 0.12)", filter: "blur(90px)" }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 h-14 border-b border-border/40 bg-background/80 backdrop-blur">
        <button
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-full bg-card/80 border border-border/40 flex items-center justify-center hover:bg-card transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <h1 className="font-display text-[18px] text-foreground">Terms of Use</h1>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 px-6 py-6 pb-12 max-w-md mx-auto"
      >
        <div
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Scale className="h-4 w-4 text-primary" />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "hsl(32 70% 36% / 0.85)" }}
          >
            Legal
          </span>
        </div>

        <p className="text-[13px] text-foreground/80 leading-relaxed mb-6 text-center">
          Please read these Terms of Use carefully before using Elyxer.
        </p>

        <div className="space-y-4">
          {sections.map(({ title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 p-4"
            >
              <h2 className="font-display text-[14px] font-semibold text-foreground mb-1.5">
                {title}
              </h2>
              <p className="text-[12px] text-foreground/70 leading-relaxed">
                {body}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] text-center text-muted-foreground/60 mt-8 leading-relaxed">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </motion.div>
    </div>
  );
};

export default TermsOfUse;
