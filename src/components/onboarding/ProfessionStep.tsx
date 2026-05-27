import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProfessionStepProps {
  onNext: (data: { industry: string; profession: string }) => void;
  onSkip: () => void;
}

const ProfessionStep = ({ onNext, onSkip }: ProfessionStepProps) => {
  const [industry, setIndustry] = useState("");
  const [profession, setProfession] = useState("");

  const canContinue = industry.trim().length > 0 || profession.trim().length > 0;

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
            Your <span className="text-primary italic">Profession</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-5 mt-6"
        >
          <div className="space-y-2">
            <label className="font-body text-[14px] font-semibold text-foreground">
              Your industry
            </label>
            <Input
              placeholder="e.g., Technology, Healthcare, Arts, Finance"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="rounded-xl border-border/60 bg-card/80 h-12 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
            />
          </div>

          <div className="space-y-2">
            <label className="font-body text-[14px] font-semibold text-foreground">
              What do you do?
            </label>
            <Input
              placeholder="e.g., Product Designer, Teacher, Entrepreneur..."
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="rounded-xl border-border/60 bg-card/80 h-12 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
            />
          </div>
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
            onClick={() => canContinue && onNext({ industry, profession })}
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

export default ProfessionStep;
