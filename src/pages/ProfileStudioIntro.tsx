import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Pen, LayoutList, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


const STEPS = [
  {
    num: 1,
    title: "Write About You",
    subtitle: "Add simple hints or words — your Interests • Work • Weekends • Passions",
    icon: Pen,
    stepLabel: "Write About You",
  },
  {
    num: 2,
    title: "Structured Profile",
    subtitle: "Your inputs (even the simplest) are intelligently structured into a refined profile",
    icon: LayoutList,
    stepLabel: "We Structure It",
  },
  {
    num: 3,
    title: "Smart Curation",
    subtitle: "Elyxer intelligently curates connections with depth and alignment",
    icon: Sparkles,
    stepLabel: "Thoughtful Curation",
  },
];

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-14 relative">
      {/* Sticky back button */}
      <header className="sticky top-0 z-30 w-full -mx-6 -mt-14 px-6 pt-3 pb-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full h-9 w-9 border border-border/40 bg-card/70 backdrop-blur-xl hover:bg-muted/30"
            style={{ boxShadow: "0 4px 24px -4px hsl(var(--foreground) / 0.06)" }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center space-y-4 mb-12 mt-2"
      >
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-body text-[10px] font-semibold uppercase tracking-[0.35em] text-primary/70"
        >
          Profile Studio
        </motion.p>
        <h1 className="font-display text-[26px] sm:text-3xl font-bold text-foreground leading-[1.25]">
          Craft the story
          <br />
          <span className="text-primary italic">that represents you</span>
        </h1>
        <p className="font-body text-[13px] text-muted-foreground max-w-[260px] mx-auto leading-relaxed">
          Go beyond the bio. Build a profile worth reading.
        </p>
      </motion.div>

      {/* Progress stepper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full max-w-xs mb-12"
      >
        <div className="flex items-start justify-between relative">
          {/* Background line */}
          <div className="absolute top-[18px] left-[16%] right-[16%] h-[2px] bg-border/50 rounded-full" />
          {/* Active progress */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "22%" }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="absolute top-[18px] left-[16%] h-[2px] rounded-full"
            style={{ background: "var(--gradient-warm)" }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 + i * 0.1 }}
              className="flex flex-col items-center z-10 gap-2"
            >
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center font-display text-[13px] font-bold transition-all duration-300 ${
                  i === 0
                    ? "text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground"
                }`}
                style={
                  i === 0
                    ? {
                        background: "var(--gradient-warm)",
                        boxShadow: "0 4px 14px -3px hsl(12 76% 61% / 0.35)",
                      }
                    : undefined
                }
              >
                {step.num}
              </div>
              <span className="font-body text-[10px] text-muted-foreground/70 text-center max-w-[72px] leading-tight">
                {step.stepLabel}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature cards */}
      <div className="w-full max-w-sm space-y-3 mb-12 flex-1 flex flex-col justify-center">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -1 }}
              className="flex items-start gap-4 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-4 cursor-default"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(135deg, hsl(12 76% 61% / 0.12), hsl(340 45% 55% / 0.08))"
                      : i === 1
                      ? "linear-gradient(135deg, hsl(30 25% 92% / 0.8), hsl(30 15% 93% / 0.6))"
                      : "linear-gradient(135deg, hsl(12 76% 61% / 0.1), hsl(340 45% 55% / 0.06))",
                }}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${
                    i === 0
                      ? "text-primary"
                      : i === 1
                      ? "text-muted-foreground"
                      : "text-primary/80"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-[14px] font-semibold text-foreground leading-snug">
                  {step.title}
                </p>
                <p className="font-body text-[11px] text-muted-foreground/70 mt-1 leading-relaxed">
                  {step.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full max-w-sm space-y-3"
      >
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => navigate("/create")}
            size="lg"
            className="w-full font-body font-semibold rounded-2xl text-[15px] h-[52px] border-0"
            style={{
              background: "var(--gradient-warm)",
              boxShadow:
                "0 8px 28px -6px hsl(12 76% 61% / 0.3), 0 2px 8px -2px hsl(340 45% 55% / 0.15)",
            }}
          >
            <span className="flex items-center gap-2.5">
              Create My Profile
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </motion.div>
        <p className="font-body text-[11px] text-muted-foreground/40 text-center tracking-wide">
          Takes about 3 minutes
        </p>
      </motion.div>
    </div>
  );
};

export default Onboarding;
