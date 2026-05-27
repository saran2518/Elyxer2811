import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const PRONOUNS = [
  "She/Her",
  "He/Him",
  "They/Them",
  "Co/Co",
  "Ze/Zir",
  "Xe/Xim",
  "Ey/Em",
  "Ve/Ver",
  "Per/Per",
];

interface PronounStepProps {
  onNext: (data: { pronouns: string[]; showOnProfile: boolean }) => void;
}

const PronounStep = ({ onNext }: PronounStepProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [showOnProfile, setShowOnProfile] = useState(true);
  const [otherActive, setOtherActive] = useState(false);
  const [otherText, setOtherText] = useState("");

  const toggle = (p: string) => {
    setSelected((prev) => {
      if (prev.includes(p)) return prev.filter((x) => x !== p);
      if (prev.length >= 2) return prev;
      return [...prev, p];
    });
  };

  const toggleOther = () => {
    if (otherActive) {
      setOtherActive(false);
      setOtherText("");
    } else if (selected.length < 2) {
      setOtherActive(true);
    }
  };

  const finalList = otherActive && otherText.trim()
    ? [...selected, otherText.trim()]
    : selected;
  const canContinue = finalList.length > 0;

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
            How do you describe
            <br />
            <span className="text-primary italic">your Pronouns?</span>
          </h1>
          <p className="font-body text-[13px] text-muted-foreground/80 mt-3">
            Select up to 2 pronouns
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap gap-2 mt-6 mb-4"
        >
          {PRONOUNS.map((p) => {
            const isOn = selected.includes(p);
            const disabled = !isOn && selected.length >= 2;
            return (
              <button
                key={p}
                onClick={() => toggle(p)}
                disabled={disabled}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-body text-[13px] border transition-all ${
                  isOn
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : disabled
                    ? "bg-card/40 border-border/40 text-muted-foreground/50 cursor-not-allowed"
                    : "bg-card border-border/60 text-foreground hover:border-primary/40"
                }`}
                style={isOn ? { boxShadow: "0 4px 14px -4px hsl(32 70% 36% / 0.3)" } : undefined}
              >
                {isOn && <Check className="h-3 w-3" />}
                {p}
              </button>
            );
          })}
          <button
            onClick={toggleOther}
            disabled={!otherActive && selected.length >= 2}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-body text-[13px] border transition-all ${
              otherActive
                ? "bg-primary text-primary-foreground border-primary"
                : selected.length >= 2
                ? "bg-card/40 border-border/40 text-muted-foreground/50 cursor-not-allowed"
                : "bg-card border-border/60 text-foreground hover:border-primary/40"
            }`}
          >
            {otherActive && <Check className="h-3 w-3" />}
            Other (self-describe)
          </button>
        </motion.div>

        {otherActive && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Input
              placeholder="Describe your pronouns"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              maxLength={30}
              className="rounded-xl border-border/60 bg-card/80 font-body text-[14px] h-11 px-4"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center gap-3 mt-2"
        >
          <Checkbox
            id="show-pronouns"
            checked={showOnProfile}
            onCheckedChange={(c) => setShowOnProfile(c === true)}
            className="h-5 w-5 rounded border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label
            htmlFor="show-pronouns"
            className="font-body text-[14px] font-semibold text-foreground cursor-pointer"
          >
            Show on your profile
          </label>
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
            Helps others refer to you correctly. You can change this anytime.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => canContinue && onNext({ pronouns: finalList, showOnProfile })}
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

export default PronounStep;
