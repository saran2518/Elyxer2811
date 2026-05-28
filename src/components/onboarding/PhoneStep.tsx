import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Info } from "lucide-react";
import { Input } from "@/components/ui/input";

const COUNTRY_CODES = [
  { code: "+91", iso: "IN", flag: "🇮🇳", name: "India" },
  { code: "+1", iso: "US", flag: "🇺🇸", name: "United States" },
  { code: "+44", iso: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+61", iso: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+971", iso: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+65", iso: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+81", iso: "JP", flag: "🇯🇵", name: "Japan" },
];

interface PhoneStepProps {
  onNext: (phoneNumber: string) => void;
}

const PhoneStep = ({ onNext }: PhoneStepProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const canContinue = phoneNumber.length >= 6;

  return (
    <>
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-[32px] sm:text-[34px] font-bold text-foreground leading-[1.15] mb-6"
        >
          Let's verify your account
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-stretch gap-3"
        >
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowCountryPicker(!showCountryPicker)}
              className="h-[52px] px-3 flex items-center gap-1.5 rounded-xl border border-border bg-transparent hover:bg-secondary/40 transition-colors"
            >
              <span className="font-body text-[15px] font-medium text-foreground">
                {selectedCountry.iso}
              </span>
              <span className="font-body text-[15px] font-semibold text-foreground">
                {selectedCountry.code}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground ml-0.5" />
            </button>

            {showCountryPicker && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 w-60 rounded-xl border border-border bg-card shadow-lg z-20 overflow-hidden"
              >
                {COUNTRY_CODES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(country);
                      setShowCountryPicker(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 transition-colors font-body text-[13px] ${
                      selectedCountry.code === country.code
                        ? "bg-secondary/40 text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-left">{country.name}</span>
                    <span className="text-muted-foreground/60">{country.code}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <Input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 h-[52px] rounded-xl border border-border bg-transparent font-body text-[15px] px-4 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="font-body text-[13px] text-muted-foreground/80 leading-relaxed mt-4"
        >
          Elyxer will send you a text with a verification code. Message and data rates may apply.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="w-full max-w-sm mx-auto mt-8 space-y-6"
      >
        <div
          className="flex items-center gap-3 rounded-2xl border border-primary/40 px-4 py-3.5"
        >
          <div
            className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Info className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <p className="font-body italic text-[13px] font-medium text-foreground leading-snug">
            Secure, private and only used for verification
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="font-body text-[13px] font-medium text-primary underline underline-offset-4"
          >
            What if my phone number changes?
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNext(`${selectedCountry.code} ${phoneNumber}`)}
            disabled={!canContinue}
            className="h-12 w-12 rounded-2xl flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
            style={{
              background: canContinue ? "var(--gradient-gold)" : "hsl(var(--secondary))",
              boxShadow: canContinue ? "var(--shadow-warm)" : undefined,
            }}
          >
            <ArrowRight className={`h-5 w-5 ${!canContinue ? "text-muted-foreground" : ""}`} />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default PhoneStep;
