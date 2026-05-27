import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LocationStepProps {
  onNext: (data: { location: string }) => void;
}

const SUGGESTED_LOCATIONS = [
  "Bengaluru Urban",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

const LocationStep = ({ onNext }: LocationStepProps) => {
  const [location, setLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const canContinue = location.trim().length > 0;

  const handleSelect = (loc: string) => {
    setLocation(loc);
    setShowSuggestions(false);
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
            Your <span className="text-primary italic">Location</span>
          </h1>
          <p className="font-body text-[13px] text-muted-foreground/80 mt-3">
            Your neighbourhood is shown, while your exact address stays private.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6 relative"
        >
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter your location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowSuggestions(e.target.value.length === 0);
              }}
              onFocus={() => setShowSuggestions(location.length === 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="rounded-xl border-border/60 bg-card/80 h-12 pl-11 pr-4 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
            />
          </div>

          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 space-y-1"
            >
              <p className="font-body text-[11px] text-muted-foreground/60 px-1">
                Suggested locations
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleSelect(loc)}
                    className="rounded-full border border-border/60 bg-card/80 px-3 py-1.5 font-body text-[12px] text-foreground hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </motion.div>
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
            Location helps us curate profile recommendations close to you.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => canContinue && onNext({ location })}
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

export default LocationStep;
