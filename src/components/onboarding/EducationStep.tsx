import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";

const EDUCATION_LEVELS = [
  "High School",
  "Undergraduate",
  "Postgraduate",
  "Doctorate/PhD",
  "Studying",
  "Prefer not to say",
];

interface EducationStepProps {
  onNext: (data: { education: string }) => void;
  onSkip: () => void;
}

const EducationStep = ({ onNext, onSkip }: EducationStepProps) => {
  const [selected, setSelected] = useState<string | null>(null);

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
            Your <span className="text-primary italic">Education</span>
          </h1>
          <p className="font-body text-[13px] text-muted-foreground/80 mt-3">
            Highest level of education
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-2.5 mt-6"
        >
          {EDUCATION_LEVELS.map((level) => {
            const isOn = selected === level;
            return (
              <button
                key={level}
                onClick={() => setSelected(level)}
                className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3.5 font-body text-[14px] transition-all ${
                  isOn
                    ? "border-primary bg-primary/5 text-foreground shadow-sm"
                    : "border-border/60 bg-card/80 text-foreground hover:border-border"
                }`}
                style={
                  isOn ? { boxShadow: "0 4px 14px -4px hsl(32 70% 36% / 0.25)" } : undefined
                }
              >
                <span className="font-medium">{level}</span>
                <span
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    isOn ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {isOn && (
                    <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                  )}
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
            Helps people get to know you better.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onSkip}
            className="font-body text-[13px] font-medium text-primary hover:text-primary/80 transition-colors text-left"
          >
            Skip for now
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => selected && onNext({ education: selected })}
            disabled={!selected}
            className="h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
            style={{
              background: selected ? "var(--gradient-warm)" : "hsl(var(--secondary))",
              boxShadow: selected ? "0 6px 20px -4px hsl(32 70% 36% / 0.35)" : undefined,
            }}
          >
            <ArrowRight className={`h-5 w-5 ${!selected ? "text-muted-foreground" : ""}`} />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default EducationStep;
