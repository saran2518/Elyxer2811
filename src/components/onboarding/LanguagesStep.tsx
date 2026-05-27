import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LanguagesStepProps {
  onNext: (data: { languages: string[] }) => void;
  onSkip: () => void;
}

const ALL_LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam",
  "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu", "Odia",
  "Assamese", "Spanish", "French", "German", "Italian", "Portuguese",
  "Mandarin", "Japanese", "Korean", "Arabic", "Russian", "Dutch",
];

const MAX = 6;

const LanguagesStep = ({ onNext, onSkip }: LanguagesStepProps) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_LANGUAGES.filter(
      (l) => l.toLowerCase().includes(q) && !selected.includes(l),
    ).slice(0, 6);
  }, [query, selected]);

  const add = (l: string) => {
    if (selected.length >= MAX || selected.includes(l)) return;
    setSelected([...selected, l]);
    setQuery("");
  };

  const remove = (l: string) => setSelected(selected.filter((x) => x !== l));

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
            Your <span className="text-primary italic">Languages</span>
          </h1>
          <p className="font-body text-[13px] text-muted-foreground/80 mt-3">
            Search and add languages
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Start Typing"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={selected.length >= MAX}
              className="rounded-xl border-border/60 bg-card/80 h-12 pl-11 pr-4 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
            />
          </div>
          <p className="font-body text-[11px] text-muted-foreground/70 mt-2 px-1">
            You can add up to {MAX} languages. ({selected.length}/{MAX})
          </p>

          {suggestions.length > 0 && (
            <div className="mt-2 rounded-xl border border-border/60 bg-card/95 overflow-hidden">
              {suggestions.map((l) => (
                <button
                  key={l}
                  onClick={() => add(l)}
                  className="w-full text-left px-4 py-2.5 font-body text-[13px] text-foreground hover:bg-primary/5 transition-colors"
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          {selected.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.map((l) => (
                <span
                  key={l}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 pl-3 pr-1 py-1 font-body text-[12px] text-foreground"
                >
                  {l}
                  <button
                    onClick={() => remove(l)}
                    className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
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
            onClick={() => onNext({ languages: selected })}
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

export default LanguagesStep;
