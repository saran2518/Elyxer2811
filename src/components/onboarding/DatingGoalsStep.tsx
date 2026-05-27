import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Check } from "lucide-react";

const GOALS = [
  { title: "Meaningful Connection", subtitle: "Trust, depth & commitment" },
  { title: "Keeping it Light", subtitle: "Fun, ease & smiles" },
  { title: "Travel Buddy", subtitle: "Journeys, stories & sunsets" },
  { title: "Shared Experiences", subtitle: "Moments, memories & laughter" },
  { title: "Discovery Mode", subtitle: "Curiosity, openness & flow" },
];

interface DatingGoalsStepProps {
  onNext: (data: { goals: string[] }) => void;
}

const DatingGoalsStep = ({ onNext }: DatingGoalsStepProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (title: string) => {
    setSelected((prev) => {
      if (prev.includes(title)) return prev.filter((x) => x !== title);
      if (prev.length >= 2) return prev;
      return [...prev, title];
    });
  };

  const canContinue = selected.length > 0;

  return (
    <>
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-2"
        >
          <h1 className="font-display text-[24px] sm:text-[28px] font-bold text-foreground leading-[1.2]">
            Your <span className="text-primary italic">Dating Goals</span>
          </h1>
          <p className="font-body text-[13px] text-muted-foreground/80 mt-3">
            Select up to 2 that fit your dating mindset.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-2.5 mt-6"
        >
          {GOALS.map((g) => {
            const isOn = selected.includes(g.title);
            const disabled = !isOn && selected.length >= 2;
            return (
              <button
                key={g.title}
                onClick={() => toggle(g.title)}
                disabled={disabled}
                className={`w-full flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left transition-all ${
                  isOn
                    ? "border-primary text-primary-foreground shadow-md"
                    : disabled
                    ? "border-border/40 bg-card/40 text-muted-foreground/60 cursor-not-allowed"
                    : "border-border/60 bg-card/80 text-foreground hover:border-border"
                }`}
                style={
                  isOn
                    ? {
                        background: "var(--gradient-warm)",
                        boxShadow: "0 6px 20px -4px hsl(32 70% 36% / 0.35)",
                      }
                    : undefined
                }
              >
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-body text-[14px] font-semibold ${
                      isOn ? "text-primary-foreground" : ""
                    }`}
                  >
                    {g.title}
                  </p>
                  <p
                    className={`font-body text-[12px] mt-0.5 ${
                      isOn ? "text-primary-foreground/85" : "text-muted-foreground"
                    }`}
                  >
                    {g.subtitle}
                  </p>
                </div>
                <span
                  className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 ml-3 ${
                    isOn
                      ? "border-primary-foreground bg-primary-foreground/20"
                      : "border-border"
                  }`}
                >
                  {isOn && <Check className="h-3 w-3 text-primary-foreground" />}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="w-full max-w-sm mx-auto space-y-4 mt-8"
      >
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <p className="font-body text-[12px] text-foreground/80 leading-relaxed">
            Helps curate better recommendations. You can change this anytime.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => canContinue && onNext({ goals: selected })}
            disabled={!canContinue}
            className="h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
            style={{
              background: canContinue ? "var(--gradient-warm)" : "hsl(var(--secondary))",
              boxShadow: canContinue ? "0 6px 20px -4px hsl(32 70% 36% / 0.35)" : undefined,
            }}
          >
            <ArrowRight className={`h-5 w-5 ${!canContinue ? "text-muted-foreground" : ""}`} />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default DatingGoalsStep;
