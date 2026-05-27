import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Check } from "lucide-react";

const OPTIONS = ["Men", "Women", "Non-binary", "Open to all"];

interface DatingPreferenceStepProps {
  onNext: (data: { preferences: string[] }) => void;
}

const DatingPreferenceStep = ({ onNext }: DatingPreferenceStepProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (opt: string) => {
    setSelected((prev) => {
      if (opt === "Open to all") {
        return prev.includes(opt) ? [] : ["Open to all"];
      }
      const without = prev.filter((x) => x !== "Open to all");
      return without.includes(opt) ? without.filter((x) => x !== opt) : [...without, opt];
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
            Who are you
            <br />
            <span className="text-primary italic">interested in dating?</span>
          </h1>
          <p className="font-body text-[13px] text-muted-foreground/80 mt-3">
            Select all that apply
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-2.5 mt-6"
        >
          {OPTIONS.map((opt) => {
            const isOn = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3.5 font-body text-[14px] transition-all ${
                  isOn
                    ? "border-primary bg-primary/5 text-foreground shadow-sm"
                    : "border-border/60 bg-card/80 text-foreground hover:border-border"
                }`}
                style={
                  isOn ? { boxShadow: "0 4px 14px -4px hsl(32 70% 36% / 0.25)" } : undefined
                }
              >
                <span className="font-medium">{opt}</span>
                <span
                  className={`h-5 w-5 rounded-md border-2 flex items-center justify-center ${
                    isOn ? "border-primary bg-primary" : "border-border"
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

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="font-body text-[13px] font-medium text-primary hover:text-primary/80 transition-colors text-left"
          >
            Learn more
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => canContinue && onNext({ preferences: selected })}
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

export default DatingPreferenceStep;
