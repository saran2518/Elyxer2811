import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface EmailOTPStepProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
}

const EmailOTPStep = ({ email, onNext, onBack }: EmailOTPStepProps) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [verified, setVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0 || verified) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, verified]);

  useEffect(() => {
    if (error && otp.length < 6) setError(null);
    if (otp.length === 6 && !verified && !isVerifying) {
      setIsVerifying(true);
      const timeout = setTimeout(() => {
        if (otp.endsWith("00")) {
          setIsVerifying(false);
          setError("Incorrect code. Please try again.");
          return;
        }
        setIsVerifying(false);
        setVerified(true);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [otp, verified, isVerifying, error]);


  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8"
        >
          <h1 className="font-display text-[24px] sm:text-[28px] font-bold text-foreground leading-[1.2] mb-2">
            Verify your Email
          </h1>
          <p className="font-body text-[13px] text-muted-foreground/70 leading-relaxed">
            We've sent a 6-digit code to
          </p>
          <p className="font-body text-[14px] font-semibold text-foreground mt-0.5">{email}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-4"
        >
          <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="gap-3 justify-start">
            <InputOTPGroup className="gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="h-14 w-12 rounded-xl border-border/60 bg-card/80 text-lg font-display font-semibold text-foreground first:rounded-xl first:border-l last:rounded-xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </motion.div>

        {verified ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-body text-[13px] font-medium text-green-600 mb-4"
          >
            Verified
          </motion.p>
        ) : (
          <p className="font-body text-[12px] text-muted-foreground/60 mb-4">
            For your security, don't share this code.
          </p>
        )}

        <div className="text-center space-y-3">
          <p className="font-body text-[13px] text-muted-foreground/70">
            Code expires in <span className="font-semibold text-foreground">{formatTime(timeLeft)}</span>
          </p>
          <p className="font-body text-[13px] text-muted-foreground/60">Didn't receive the code?</p>
          <button
            type="button"
            onClick={() => { setTimeLeft(120); setOtp(""); setVerified(false); }}
            className="font-body text-[13px] font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Resend code
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-sm mx-auto flex items-center justify-between mt-8"
      >
        <button
          type="button"
          onClick={onBack}
          className="font-body text-[13px] font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Change mail id
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          disabled={!verified}
          className="h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
          style={{
            background: verified ? "var(--gradient-warm)" : "hsl(var(--secondary))",
            boxShadow: verified ? "0 6px 20px -4px hsl(12 76% 61% / 0.35)" : undefined,
          }}
        >
          <ArrowRight className={`h-5 w-5 ${!verified ? "text-muted-foreground" : ""}`} />
        </motion.button>
      </motion.div>
    </>
  );
};

export default EmailOTPStep;
