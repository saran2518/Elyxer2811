import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";

interface HeightStepProps {
  onNext: (data: { heightCm: number }) => void;
  onSkip: () => void;
}

type Unit = "ft" | "cm";

const ITEM_HEIGHT = 44;

const formatFt = (cm: number) => {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - ft * 12);
  if (inches === 12) return `${ft + 1}' 0"`;
  return `${ft}' ${inches}"`;
};

const HeightStep = ({ onNext, onSkip }: HeightStepProps) => {
  const [unit, setUnit] = useState<Unit>("cm");
  const [selectedCm, setSelectedCm] = useState(170);
  const scrollRef = useRef<HTMLDivElement>(null);

  const values = useMemo(() => {
    const arr: { cm: number; label: string }[] = [];
    for (let cm = 140; cm <= 220; cm++) {
      arr.push({ cm, label: unit === "cm" ? `${cm} cm` : formatFt(cm) });
    }
    return arr;
  }, [unit]);

  // center the selected value
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = values.findIndex((v) => v.cm === selectedCm);
    if (idx >= 0) {
      el.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
    }
  }, [unit]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
    const v = values[Math.min(Math.max(idx, 0), values.length - 1)];
    if (v && v.cm !== selectedCm) setSelectedCm(v.cm);
  };

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
            Your <span className="text-primary italic">Height</span>
          </h1>
          <p className="font-body text-[13px] text-muted-foreground/80 mt-3">
            Scroll to select your height
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6"
        >
          <div className="inline-flex p-1 rounded-full border border-border/60 bg-card/80">
            {(["ft", "cm"] as Unit[]).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-5 py-1.5 rounded-full font-body text-[12px] font-semibold uppercase tracking-wide transition-all ${
                  unit === u ? "text-primary-foreground" : "text-muted-foreground"
                }`}
                style={
                  unit === u
                    ? { background: "var(--gradient-warm)" }
                    : undefined
                }
              >
                {u}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mt-6 h-[220px] rounded-2xl border border-border/60 bg-card/40 overflow-hidden"
        >
          {/* Center highlight box */}
          <div
            className="pointer-events-none absolute left-4 right-4 top-1/2 -translate-y-1/2 rounded-xl border-2 z-10"
            style={{
              height: ITEM_HEIGHT,
              borderColor: "hsl(var(--primary))",
              boxShadow: "0 0 0 4px hsl(32 70% 36% / 0.08)",
            }}
          />
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            style={{
              paddingTop: 220 / 2 - ITEM_HEIGHT / 2,
              paddingBottom: 220 / 2 - ITEM_HEIGHT / 2,
              scrollbarWidth: "none",
            }}
          >
            {values.map((v) => {
              const isOn = v.cm === selectedCm;
              return (
                <div
                  key={v.cm}
                  className={`snap-center flex items-center justify-center font-display text-[18px] transition-all ${
                    isOn ? "text-primary font-bold text-[20px]" : "text-muted-foreground/60"
                  }`}
                  style={{ height: ITEM_HEIGHT }}
                >
                  {v.label}
                </div>
              );
            })}
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
            Helps curate recommendations, you can update this anytime.
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
            onClick={() => onNext({ heightCm: selectedCm })}
            className="h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground transition-opacity"
            style={{
              background: "var(--gradient-warm)",
              boxShadow: "0 6px 20px -4px hsl(32 70% 36% / 0.35)",
            }}
          >
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default HeightStep;
